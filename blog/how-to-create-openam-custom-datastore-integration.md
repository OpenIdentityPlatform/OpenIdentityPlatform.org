---
layout: home
title: "How to Create Custom OpenAM DataStore Integration"
landing-title2: "How to Customise OpenAM"
description: "This article explains how develop IdRepo plugin to connect to an external user data store"
keywords: 'OpenAM, Customisation'
imageurl: 'openam-og.png'
share-buttons: true
---
<h1>How to Create Custom OpenAM DataStore Integration</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Create-Custom-OpenAM-DataStore-Integration](https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Create-Custom-OpenAM-DataStore-Integration)

- [Introduction](#introduction)
- [Custom IdRepo Implementation](#custom-idrepo-implementation)
- [Service Schema](#service-schema)
- [Add Schema to OpenAM Distribution](#add-schema-to-openam-distribution)
- [Add Schema to an Exististing OpenAM Deployment](#add-schema-to-an-exististing-openam-deployment)
- [IdRepo Plugin in Action](#idrepo-plugin-in-action)
- [Conclusion](#conclusion)

## Introduction

OpenAM already have implementations for variuos user data sources - LDAP, Active Directiry, relational databases via JDBC driver and Apache Cassandra. But there are databases that are not integratied into OpenAM. The following manual shows how to implement a custom data source to use for authentication.
We will write together MongoDB integration to authenticate users in MongoDB datastore. The implementations will support only read users from the datastore and won't support write operation or groups, but it would be enough for get the point. 

## Custom IdRepo Implementation

To write your own integration with a custom data source you should extend [com.sun.identity.idm.IdRepo](https://github.com/OpenIdentityPlatform/OpenAM/blob/master/openam-core/src/main/java/com/sun/identity/idm/IdRepo.java) abstract class.

To simplify the example our repository will be only able to show users, and authenticate against database.

Lets create `org.openidentityplatform.openam.mongodb.Repo` that extends `com.sun.identity.idm.IdRepo` class. Override `getSupportedOperations`, `getSupportedTypes` and `supportsAuthentication` functions.


```java
public class Repo extends IdRepo {

    @Override
    public Set<IdOperation> getSupportedOperations(IdType type) {
        return Collections.singleton(IdOperation.READ);
    }

    @Override
    public Set<IdType> getSupportedTypes() {
        return Collections.singleton(IdType.USER);
    }

    @Override
    public boolean supportsAuthentication() {
        return true;
    }


}
```

Then add MongoDB connection settings and override the `initialize` function.


```java
    private static final String MONGODB_SERVER =
            "sun-idrepo-ldapv3-config-ldap-server";

    private static final String MONGODB_DATABASE =
            "sun-idrepo-ldapv3-config-organization_name";

    private static final String USER_PASSWORD_ATTRIBUTE = "userpassword";
    
    String mongoDbUrl;

    MongoDatabase mongoDatabase;

    String databaseName;

    String usersMongoCollection = "users";

    @Override
    public void initialize(Map<String, Set<String>> configParams) throws IdRepoException  {
        super.initialize(configParams);
        mongoDbUrl = "mongodb://".concat(String.join(",", configParams.get(MONGODB_SERVER)));
        databaseName = CollectionHelper.getMapAttr(configParams, MONGODB_DATABASE);
        MongoClient mongoClient = MongoClients.create(mongoDbUrl);
        mongoDatabase = mongoClient.getDatabase(databaseName);
    }
```

Override the functions responsible to search and retrieve attributes from a database:

```java
    @Override
    public RepoSearchResults search(SSOToken token, IdType type, CrestQuery crestQuery, int maxTime, int maxResults,
                                    Set<String> returnAttrs, boolean returnAllAttrs, int filterOp,
                                    Map<String, Set<String>> avPairs, boolean recursive) throws IdRepoException, SSOException {

        final Map<String, Map<String,Set<String>>> result = new HashMap<>();

        FindIterable<Document> findIterable = mongoDatabase.getCollection(usersMongoCollection).find().limit(maxResults);
        if(CollectionUtils.isNotEmpty(returnAttrs)) {
            Bson projection = Projections.fields(Projections.include(new ArrayList<>(returnAttrs)));
            findIterable = findIterable.projection(projection);
        }

        if(MapUtils.isNotEmpty(avPairs)) {
            Bson filters = Filters.empty();
            for(Map.Entry<String, Set<String>> entry: avPairs.entrySet()) {
                List<Bson> entryFilters = entry.getValue().stream().map(v -> Filters.eq(entry.getKey(), v)).collect(Collectors.toList());
                Bson entryFilter = Filters.or(entryFilters);
                filters = Filters.and(entryFilter);
            }
            findIterable = findIterable.filter(filters);
        }

        try(MongoCursor<Document> iterator = findIterable.iterator()) {
            while (iterator.hasNext()) {
                Document doc = iterator.next();
                String id = doc.getObjectId("_id").toHexString();
                Map<String, Set<String>> attributesValues = documentToUserAttributes(doc);
                result.put(id, attributesValues);
            }
        }

        int errCode = (maxResults > 0 && result.size() > maxResults) ? RepoSearchResults.SIZE_LIMIT_EXCEEDED : RepoSearchResults.SUCCESS;
        return new RepoSearchResults(result.keySet(), errCode, result,type);
    }

    @Override
    public Map<String, Set<String>> getAttributes(SSOToken token, IdType type, String name) throws IdRepoException, SSOException {
        return getAttributes(token, type, name, null);
    }

    @Override
    public Map<String, Set<String>> getAttributes(SSOToken token, IdType type, String name, Set<String> attrNames) throws IdRepoException, SSOException {
        try {
            final Bson filter = Filters.eq("_id", new ObjectId(name));
            Bson projection = Projections.exclude();
            if(attrNames != null) {
                projection = Projections.fields(Projections.include(new ArrayList<>(attrNames)));
            }
            Document doc = mongoDatabase.getCollection(usersMongoCollection).find(filter).projection(projection).first();
            if (doc == null) {
                return Collections.emptyMap();
            }
            return documentToUserAttributes(doc);

        } catch (Exception e) {
            throw new IdRepoException(e.getMessage());
        }
    }

     @Override
    public boolean isExists(SSOToken token, IdType type, String name) throws IdRepoException, SSOException {
        try {
            final Bson filter = Filters.eq("_id", new ObjectId(name));
            Document doc = mongoDatabase.getCollection(usersMongoCollection).find(filter).first();
            return doc != null;
        } catch (Exception e) {
            throw new IdRepoException(e.getMessage());
        }
    }

    @Override
    public boolean isActive(SSOToken token, IdType type, String name) throws IdRepoException, SSOException {
        return true; //consider all identities are active
    }
```

Then implement authenticate function, which is responsible to authenticate users against a database. Password hashing is not supported, but should be implemented for production.

```java
    @Override
    public boolean authenticate(Callback[] credentials) throws IdRepoException, AuthLoginException {
        String userName = null;
        String password = null;
        for (Callback callback : credentials) {
            if (callback instanceof NameCallback) {
                userName = ((NameCallback) callback).getName();
            } else if (callback instanceof PasswordCallback) {
                password = new String(((PasswordCallback) callback).getPassword());
            }
        }
        if (userName == null || password == null) {
            throw new IdRepoException(IdRepoErrorCode.UNABLE_TO_AUTHENTICATE,Repo.class.getName());
        }
        try {
            Map<String, Set<String>> res = getAttributes(null, IdType.USER, userName, Collections.singleton(USER_PASSWORD_ATTRIBUTE));
            if (res!=null && res.containsKey(USER_PASSWORD_ATTRIBUTE) && res.get(USER_PASSWORD_ATTRIBUTE).size() > 0) {
                final String storedPassword=res.get(USER_PASSWORD_ATTRIBUTE).iterator().next();
                return storedPassword.equals(password);
            }
        } catch (SSOException e) {
            throw new AuthLoginException(e);
        }
        return false;
    }

```

Remaining functions should return default result or throw `IdRepoException`, for example
```java
    private final static IdRepoException OPERATION_NOT_SUPPORTED_EXCEPTION = new IdRepoException("operation not supported");

    @Override
    public Map<String, byte[][]> getBinaryServiceAttributes(SSOToken token, IdType type, String name, String serviceName, Set<String> attrNames) throws IdRepoException, SSOException {
        return Collections.emptyMap();
    }

    @Override
    public void modifyService(SSOToken token, IdType type, String name, String serviceName, SchemaType sType, Map<String, Set<String>> attrMap) throws IdRepoException, SSOException {
        throw OPERATION_NOT_SUPPORTED_EXCEPTION;
    }
```

Build the class and include it into classpath of OpenAM war file as desctibed in [How to Customise OpenAM](https://github.com/OpenIdentityPlatform/OpenAM/wiki/How-to-Customise-OpenAM) article. Dependencies for the maven project

```xml
 <dependency>
    <groupId>org.mongodb</groupId>
    <artifactId>mongodb-driver-sync</artifactId>
    <version>4.9.1</version>
</dependency>
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.11</version>
</dependency>
```
## Service Schema

OpenAM MongoDM service sub-schema will look like this.

```xml
<SubSchema i18nKey="MongoDB" inheritance="multiple"
    maintainPriority="no" name="MongoDBRepo"
    supportsApplicableOrganization="no" validate="yes">
    <AttributeSchema cosQualifier="default"
        isSearchable="no" name="RequiredValueValidator" syntax="string"
        type="validator">
        <DefaultValues>
            <Value>com.sun.identity.sm.RequiredValueValidator</Value>
        </DefaultValues>
    </AttributeSchema>
    <AttributeSchema any="required" cosQualifier="default"
        i18nKey="a4010" isSearchable="no" name="sunIdRepoClass" syntax="string"
        type="single" validator="RequiredValueValidator">
        <DefaultValues>
            <Value>org.openidentityplatform.openam.mongodb.Repo</Value>
        </DefaultValues>
    </AttributeSchema>
    <AttributeSchema any="required" cosQualifier="default"
                        i18nKey="Servers" isSearchable="no"
                        name="sun-idrepo-ldapv3-config-ldap-server" syntax="string" type="list"
                        validator="RequiredValueValidator">
        <DefaultValues>
            <Value>localhost:27017</Value>
        </DefaultValues>
    </AttributeSchema>
    <AttributeSchema cosQualifier="default" i18nKey="Database"
        isSearchable="no" name="sun-idrepo-ldapv3-config-organization_name" syntax="string"
        type="single">
        <DefaultValues>
            <Value>authentication</Value>
        </DefaultValues>
    </AttributeSchema>
</SubSchema>
```

## Add Schema to OpenAM Distribution

To let OpenAM know about the new Data Source, the subschema should be added to OpenAM `sunIdentityRepositoryService` service configuration.
If you plan to add the repository plugin to OpenAM distribution and/or make a contribution to [OpenAM](https://github.com/OpenIdentityPlatform/OpenAM).
Add MongoDB subschema to subschema list to [openam-server-only/src/main/resources/services/idRepoService.xml](https://github.com/OpenIdentityPlatform/OpenAM/blob/master/openam-server-only/src/main/resources/services/idRepoService.xml) file.

## Add Schema to an Exististing OpenAM Deployment

If you have an existing OpenAM deployment, connect to OpenDJ instance for OpenAM configuration in any LDAP client Application, for example, Apache Directory Studio, and add sub schema to `sunIdentityRepositoryService` xml configuration as shown in the picture below. Then restart OpenAM instance.

![Add ID Repo to OpenDJ](/assets/img/openam-idrepo/idrepo-ldap.png)

## IdRepo Plugin in Action

After we have added a new datastore to the schema, create a new MongoDB Data Store in OpenAM and see it in action.

Run MongoDB in docker container in a local environment:

```bash
docker run -p 27017:27017 --name test-mongo mongo:latest
```
Add a couple of users to the MongoDB with the following script:

```javascript
db = connect( 'mongodb://localhost:27017/authentication');
db.users.insertMany([
    {
        cn: 'John Doe',
        sunidentitymsisdnnumber: "123-456-78-90",
        userpassword: 'passw0rd',
    },
    {
        cn: 'Jane Doe',
        sunidentitymsisdnnumber: "123-456-78-91",
        userpassword: 'passw0rd',
    },
])
```
Open the OpenAM console, create a new realm `/clients`, remove the existing DataStore, and add a new MongoDB DataStore to the realm.

![MongoDB IdRepo](/assets/img/openam-idrepo/idrepo-mongodb.png)

Open the Subjects tab and see if there are user entries:


![MongoDB User Entries](/assets/img/openam-idrepo/idrepo-subjects.png)

Test authentication via API, using Universal Id value as login and password from the script above.

```bash
% curl --location --request POST 'http://localhost:8080/openam/json/authenticate?realm=/clients' \
--header 'X-OpenAM-Username: 64994f6b8beb1a6fbe461660' \
--header 'X-OpenAM-Password: passw0rd' \
--header 'Content-Type: application/json'         

{"tokenId":"AQIC5wM2LY4Sfcx71mFbrHLrhHsv5hFyLEM_7S-nbKBNrVg.*AAJTSQACMDEAAlNLABI0OTk2NDUxMTgwNTY4NTQ1NjUAAlMxAAA.*","successUrl":"/openam/console","realm":"/clients"}
```

## Conclusion
In the following article, we have developed a very simple User Data Store without any modification, just to understand how it works. For a production environment password hashing connection pooling etc, should be implemented.



(/assets/img/openam-idrepo/idrepo-ldap.png)