---
layout: home
landing-title: "Welcome to Open Identity Platform Community"
landing-title2: "Open Identity Platform Community is open-source community organization, hosted on <a href=\"https://github.com/OpenIdentityPlatform\">GitHub</a>"
---
# Аутентификация через госуслуги (ЕСИА)

Для аутентификации ЕСИА реализует стандарты SAML и OpenID Connect 1.0, но с некоторыми отличиями от RFC. В данной статье рассматривается реализация аутентификации с использованием OpenID Connect 1.0.
Для того, чтобы подключить аутентификацию через ЕСИА к сайту, нужно зарегистрировать ИС на сайте ГосУслуги, и в результате вы получите идентификатор приложения, публичный сертификат и приватный ключ. 
Далее, на сайте размещается кнопка "Войти через ГосУслуги", которая перенаправляет пользователя на ЕСИА. Url ссылки рассчитывается следующим образом:

```
https://<ESIA_HOST>/aas/oauth2/ac?client_id={0}&client_secret={1}
&redirect_uri={2}&scope={3}&response_type=code&state={4}
&timestamp={5}&access_type={6}
```

|Параметр|Описание|
|-----|-----------|
|ESIA_HOST|сервер ЕСИА, для продуктивной среды хост будет esia.gosuslugi.ru, для тестовой среды -  esia-portal1.test.gosuslugi.ru.|
|client_id|Идентификатор приложения|
|client_secret|Секрет приложения, рассчиывтается динамически с использованием ключа и сертификата|
|redirect_uri|URL, на который будет перенаправлен пользователь после аутентификации в ЕСИА, содержит ответ аутентификации|
|scope|Набор запрашиваемых у пользователя разрешений на доступ к данным|
|response_type|тип ответа, который возвращает ЕСИА может быть или code или token |
|state|Набор случайных символов, имеющий формат UUID|
|timestamp|Время аутентификаци в формате yyyy.MM.dd HH:mm:ss Z |
|access_type|online - если требуется доступ только при присуствии пользователя, offline - доступ предоставляется без присуствия пользователя|

### Расчет секрета приложения (client_secret)

Секрет приложения расчитывается как подпись конкатенации параметров __scope, timestamp, client_id, state__, закодированная как __base64 URL safe__.

Пример класса расчета подписи

{% highlight java %}
public class Signer {

	final static Logger logger = LoggerFactory.getLogger(Signer.class);

	private static X509CertificateHolder getCert() {
		return Signer.certHolder;
	}

	private static PrivateKey getPrivateKey() {
		return Signer.kp.getPrivate();
	}

	public static String signString(String data)  {
		if(kp == null || certHolder == null)
			initKeys();
		String encoded = null;
		Security.addProvider(new BouncyCastleProvider());

		List<X509CertificateHolder> certList = new ArrayList<>();
		CMSTypedData msg = new CMSProcessableByteArray(data.getBytes());

		certList.add(getCert()); // Adding the X509 Certificate
		try {
			Store<?> certs = new JcaCertStore(certList);

			CMSSignedDataGenerator gen = new CMSSignedDataGenerator();
			// Initializing the the BC's Signer
			ContentSigner shaSigner = new JcaContentSignerBuilder("SHA256withRSA")
					.setProvider("BC").build(getPrivateKey());

			gen.addSignerInfoGenerator(new JcaSignerInfoGeneratorBuilder(
					new JcaDigestCalculatorProviderBuilder().setProvider("BC")
							.build()).build(shaSigner, getCert()));

			gen.addCertificates(certs);

			CMSSignedData sigData = gen.generate(msg, false);
			sigData.getSignerInfos();

			encoded = Base64.encodeBase64URLSafeString(sigData.getEncoded());
		} catch(Exception e) {
			logger.error("error sign string{} {}", data, e.toString());
		}

		return encoded;

	}

	static KeyPair kp;
	static X509CertificateHolder certHolder;

	static final String keyPath = SystemProperties.get(Signer.class.getName().concat(".keyPath")); //путь к приватоному ключу ЕСИА
	static final String certPath = SystemProperties.get(Signer.class.getName().concat(".certPath")); //путь к сертификату ЕСИА

	private static synchronized void initKeys() {

		Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());

		PEMParser pemReader = null;
		PEMParser certPemReader = null;
		try {

			Object obj = null;
			try (FileReader fileReader = new FileReader(keyPath)) {
				pemReader = new PEMParser(fileReader);
				obj = pemReader.readObject();
				pemReader.close();
			}
			Object certObj = null;
			try (FileReader fileCertReader = new FileReader(certPath)) {
				certPemReader = new PEMParser(fileCertReader);
				certObj = certPemReader.readObject();
				certPemReader.close();
			}

			PEMKeyPair pemKeyPair = (PEMKeyPair) obj;
			kp = new JcaPEMKeyConverter().getKeyPair(pemKeyPair);

			certHolder = ((X509CertificateHolder) certObj);

		} catch (IOException ex) {
			logger.error("error init keys {}", ex.toString());
		}
	}
}
{% endhighlight %}

#### Расчет client_secret
{% highlight java %}
Signer.signString(scope + timestamp + client_id + state);
{% endhighlight %}

Если URL сформирован корректно, пользователя перенаправляет на портал ЕСИА, где пользователь проходит аутентификацию, и соглашается на доступ к его данным. Если аутенитфикация прошла успешно, то ЕСИА перенаправляет пользтваеля на целевой сайт, и в URL передает два параметра __code__ и __state__
* __state__ - предзназначен для проверки безопасности ответа ЕСИА, должен совпадать со __state__ переданным в URL авторизации ЕСИАю
* __code__ - код авторизации, обменивается на access_token, с помощью которого осуществляется доступ к данным.

### Получение метки доступа (access_token)

После того, как получе код авторизации, его нужно обменять на access_token. Для этого нужно отправить POST запрос по адресу
```
https://<ESIA_HOST>/aas/oauth2/te
```
с параметрами
