---
layout: home
title: "ForgeRock Alternative & Migration Path — Open Identity Platform"
description: "A free, open-source alternative to ForgeRock. Open Identity Platform continues the OpenAM, OpenDJ, OpenIDM, OpenIG and OpenICF line under the CDDL license — no license fees, no lock-in. Map your ForgeRock stack and plan a migration."
keywords: "ForgeRock alternative, ForgeRock open source alternative, ForgeRock migration, migrate from ForgeRock, ForgeRock to open source, ForgeRock AM alternative, ForgeRock DS alternative, ForgeRock IDM alternative, ForgeRock IG alternative, OpenAM ForgeRock, OpenDJ ForgeRock, ForgeRock end of life, ForgeRock replacement, IAM migration"
lastmod: 2026-07-17
faq:
  - q: "Is Open Identity Platform the same as ForgeRock?"
    a: "No. Open Identity Platform is an independent community project. Its products — OpenAM, OpenDJ, OpenIDM, OpenIG and OpenICF — continue the open-source releases that ForgeRock's commercial products were built on, maintained under the CDDL license."
  - q: "Do I have to pay license fees to move off ForgeRock?"
    a: "No. Every Open Identity Platform product is free and open source under the CDDL license — no license fees and no vendor lock-in. Commercial support is entirely optional and comes from independent vendors, not a mandatory subscription."
  - q: "Can I migrate my existing ForgeRock configuration and data?"
    a: "Because the products share a common lineage, many concepts, configurations, and directory data map closely between ForgeRock and Open Identity Platform. The exact effort depends on your versions and customizations — read the documentation, ask the community, or engage an approved vendor for a migration assessment."
  - q: "Where do I get help migrating from ForgeRock?"
    a: "Free community help is available on GitHub Discussions, and full documentation is online. For SLAs, consulting, and hands-on migration work, independent approved vendors are listed on the Support & Services page."
navbar:
  support_active: ''
---

<div class="bg-primary text-white p-4 p-md-5 rounded mb-5">
  <h1>ForgeRock Alternative &amp; Open-Source Migration Path</h1>
  <p class="lead mb-0">Open Identity Platform is the free, open-source continuation of the identity stack that ForgeRock was built on. Same lineage, CDDL licensed, no license fees, no vendor lock-in.</p>
</div>

<p>ForgeRock built its identity platform on a family of open-source projects covering access management, directory services, identity management, and an identity gateway. Over time those products moved to a closed, subscription-only model. The open-source line did not disappear: the community forked the last freely-licensed releases and has maintained, secured, and modernized them ever since as the <strong>Open Identity Platform</strong>.</p>

<p>If you run a ForgeRock deployment — or you're weighing its roadmap and licensing — Open Identity Platform is a like-for-like path that keeps your architecture open. Community help stays free on GitHub; independent vendors offer paid migration and support when you want it.</p>

<h2 class="mb-3">Map your ForgeRock stack to Open Identity Platform</h2>
<p class="text-muted">Each ForgeRock product has a directly corresponding open-source project here.</p>
<div class="table-responsive mb-5">
  <table class="table table-bordered align-middle">
    <thead>
      <tr>
        <th scope="col">ForgeRock product</th>
        <th scope="col">Open Identity Platform</th>
        <th scope="col">What it does</th>
        <th scope="col">Get it</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>ForgeRock Access Management (AM)</td>
        <td><a href="/openam"><strong>OpenAM</strong></a></td>
        <td>Authentication, SSO, authorization, federation, OAuth2/OIDC/SAML</td>
        <td><a href="https://github.com/OpenIdentityPlatform/OpenAM" target="_blank" rel="noopener">GitHub</a></td>
      </tr>
      <tr>
        <td>ForgeRock Directory Services (DS)</td>
        <td><a href="/opendj"><strong>OpenDJ</strong></a></td>
        <td>LDAPv3-compliant, high-availability directory / identity store</td>
        <td><a href="https://github.com/OpenIdentityPlatform/OpenDJ" target="_blank" rel="noopener">GitHub</a></td>
      </tr>
      <tr>
        <td>ForgeRock Identity Management (IDM)</td>
        <td><a href="/openidm"><strong>OpenIDM</strong></a></td>
        <td>Identity management, provisioning, synchronization, compliance</td>
        <td><a href="https://github.com/OpenIdentityPlatform/OpenIDM" target="_blank" rel="noopener">GitHub</a></td>
      </tr>
      <tr>
        <td>ForgeRock Identity Gateway (IG)</td>
        <td><a href="/openig"><strong>OpenIG</strong></a></td>
        <td>Reverse proxy / identity gateway, session and credential handling</td>
        <td><a href="https://github.com/OpenIdentityPlatform/OpenIG" target="_blank" rel="noopener">GitHub</a></td>
      </tr>
      <tr>
        <td>ForgeRock connectors (ICF)</td>
        <td><a href="/openicf"><strong>OpenICF</strong></a></td>
        <td>Identity connector framework linking IDM to target systems</td>
        <td><a href="https://github.com/OpenIdentityPlatform/OpenICF" target="_blank" rel="noopener">GitHub</a></td>
      </tr>
    </tbody>
  </table>
</div>

<h2 class="mb-3">Why organizations move to Open Identity Platform</h2>
<div class="row g-4 mb-5">
  <div class="col-md-6 col-lg-4">
    <div class="card h-100"><div class="card-body">
      <h3 class="h5 card-title"><i class="fa-solid fa-lock-open me-2"></i>Stay open source</h3>
      <p class="card-text mb-0">Every product is CDDL-licensed and free to download, run, and modify. No per-user or per-server license fees.</p>
    </div></div>
  </div>
  <div class="col-md-6 col-lg-4">
    <div class="card h-100"><div class="card-body">
      <h3 class="h5 card-title"><i class="fa-solid fa-unlock me-2"></i>No vendor lock-in</h3>
      <p class="card-text mb-0">Open code, open standards (OAuth2, OIDC, SAML, LDAP). You control your deployment and your data.</p>
    </div></div>
  </div>
  <div class="col-md-6 col-lg-4">
    <div class="card h-100"><div class="card-body">
      <h3 class="h5 card-title"><i class="fa-solid fa-code-branch me-2"></i>Same lineage</h3>
      <p class="card-text mb-0">The projects share a common heritage with ForgeRock's, so your existing concepts, skills, and architecture carry over.</p>
    </div></div>
  </div>
  <div class="col-md-6 col-lg-4">
    <div class="card h-100"><div class="card-body">
      <h3 class="h5 card-title"><i class="fa-solid fa-shield-halved me-2"></i>Actively maintained</h3>
      <p class="card-text mb-0">Regular releases and security fixes across all five products, published openly on GitHub.</p>
    </div></div>
  </div>
  <div class="col-md-6 col-lg-4">
    <div class="card h-100"><div class="card-body">
      <h3 class="h5 card-title"><i class="fa-solid fa-people-group me-2"></i>Community first</h3>
      <p class="card-text mb-0">Free help on GitHub Discussions and open documentation — no support contract required to get started.</p>
    </div></div>
  </div>
  <div class="col-md-6 col-lg-4">
    <div class="card h-100"><div class="card-body">
      <h3 class="h5 card-title"><i class="fa-solid fa-headset me-2"></i>Support when you need it</h3>
      <p class="card-text mb-0">Independent approved vendors offer SLAs, consulting, and migration services — optional, and neutral by design.</p>
    </div></div>
  </div>
</div>

<h2 class="mb-3">How a migration typically works</h2>
<p>Every environment is different, but migrations from a ForgeRock stack generally follow the same shape. Because the codebases share a lineage, much of your configuration maps across — but always validate against your own deployment.</p>
<ol class="mb-5">
  <li class="mb-2"><strong>Assess</strong> — inventory your ForgeRock components, versions, customizations, and integrations, and map them to the products above.</li>
  <li class="mb-2"><strong>Stand up Open Identity Platform</strong> — deploy the matching products (start with the directory and access management) in a test environment.</li>
  <li class="mb-2"><strong>Migrate configuration and data</strong> — move realms, policies, agents, connectors, and directory data; adapt customizations where needed.</li>
  <li class="mb-2"><strong>Validate</strong> — test authentication flows, federation, provisioning, and integrations against your requirements.</li>
  <li class="mb-2"><strong>Cut over</strong> — plan the switch, run in parallel if you can, and keep a rollback path.</li>
</ol>

<div class="bg-primary text-white p-4 p-md-5 rounded mb-5">
  <div class="row align-items-center">
    <div class="col-md-8 mb-3 mb-md-0">
      <h2 class="h4 mb-1">Planning a move off ForgeRock?</h2>
      <p class="mb-0">Start free on GitHub, or bring in an independent vendor for a migration assessment, SLAs, and hands-on help. The project stays neutral — vendors are listed alphabetically, with no endorsement.</p>
    </div>
    <div class="col-md-4 text-md-end">
      <a href="/support" class="btn btn-support" data-ga-event="support_cta_click" data-ga-location="forgerock_migration">
        <i class="fa-solid fa-headset me-2"></i>Support &amp; migration
      </a>
    </div>
  </div>
</div>

<h2 class="mb-3">Frequently asked questions</h2>
<div class="row g-4 mb-4">
  {% for item in page.faq %}
  <div class="col-md-6">
    <div class="card h-100">
      <div class="card-body">
        <h3 class="h6 card-title">{{ item.q }}</h3>
        <p class="card-text mb-0">{{ item.a }}</p>
      </div>
    </div>
  </div>
  {% endfor %}
</div>
