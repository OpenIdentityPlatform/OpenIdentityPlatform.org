---
layout: home
title: "Commercial Support & Services"
description: "Get support for OpenAM, OpenDJ, OpenIG, OpenIDM and OpenICF. Free community help on GitHub, plus SLAs, consulting, implementation and migration from approved independent vendors."
keywords: "Open Identity Platform support, OpenAM commercial support, OpenDJ enterprise support, OpenAM SLA, OpenAM consulting, OpenIG support, OpenIDM support, IAM support vendors, OpenAM migration services, ForgeRock migration support"
lastmod: 2026-07-28
service_schema: true
faq:
  - q: "Is Open Identity Platform free to use?"
    a: "Yes. Every product is open source under the CDDL license — no license fees and no vendor lock-in. Commercial support is entirely optional."
  - q: "How do I get free help?"
    a: "Ask the community on GitHub Discussions and read the documentation. There is no cost, and no account beyond a free GitHub login is required."
  - q: "Who provides commercial support?"
    a: "Independent, approved vendors listed on this page provide SLAs, consulting, implementation, and migration services. They are separate companies, not the project itself."
  - q: "How are the vendors chosen and ordered?"
    a: "Vendors come from the project's official Approved Vendor List and are shown here in alphabetical order. Listing is not an endorsement, and the order implies no ranking."
navbar:
  support_active: 'active'
---

<div class="support-hero bg-primary text-white p-4 p-md-5 rounded mb-5">
  <h1>Support &amp; Services</h1>
  <p class="lead mb-0">Open Identity Platform is free and open source. Get help the way that suits you — ask the community at no cost, or engage an approved independent vendor for SLAs, consulting, and migration. One platform, two paths to support.</p>
</div>

<p class="fr-callout"><i class="fa-solid fa-circle-info me-2"></i>Migrating from ForgeRock? See the <a href="/forgerock-alternative">ForgeRock alternative &amp; migration path</a> to map your stack to Open Identity Platform.</p>

<h2 class="mb-1">Free community support</h2>
<p class="text-muted">Start here — it's free, and most questions are answered by the people who build the software.</p>
<div class="row g-4 mb-5">
  <div class="col-md-4">
    <div class="card h-100">
      <div class="card-body">
        <h3 class="h5 card-title"><i class="fa-solid fa-comments me-2"></i>GitHub Discussions</h3>
        <p class="card-text">Ask questions, share deployments, and get help from maintainers and the wider community.</p>
        <a href="https://github.com/orgs/OpenIdentityPlatform/discussions" target="_blank" rel="noopener">Open Discussions <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card h-100">
      <div class="card-body">
        <h3 class="h5 card-title"><i class="fa-solid fa-book me-2"></i>Documentation</h3>
        <p class="card-text">Guides, references, and how-tos for every product — from first install to production tuning.</p>
        <a href="https://doc.openidentityplatform.org" target="_blank" rel="noopener">Read the docs <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card h-100">
      <div class="card-body">
        <h3 class="h5 card-title"><i class="fa-brands fa-github me-2"></i>Issue trackers</h3>
        <p class="card-text">Report a bug or request a feature directly in the product's repository on GitHub.</p>
        <a href="https://github.com/OpenIdentityPlatform" target="_blank" rel="noopener">Browse repositories <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </div>
  </div>
</div>

<h2 class="mb-1" id="vendors">Commercial support vendors</h2>
<p class="text-muted">Independent companies offering SLAs, consulting, implementation, and migration services.</p>

<p class="vendor-neutrality-note">
  Vendors are independent companies from the project's official
  <a href="https://github.com/OpenIdentityPlatform/.github/wiki/Approved-Vendor-List" target="_blank" rel="noopener">Approved Vendor List</a>,
  shown in alphabetical order. Listing here is not an endorsement, and the order implies no ranking.
  The location shown is each vendor's headquarters — most serve clients worldwide, so choose <strong>All</strong> to see everyone.
</p>

<div class="region-filter mb-4" role="group" aria-label="Filter vendors by headquarters region">
  <button type="button" class="btn active" data-region="all" aria-pressed="true">All</button>
  <button type="button" class="btn" data-region="europe" aria-pressed="false">Europe</button>
  <button type="button" class="btn" data-region="americas" aria-pressed="false">Americas</button>
  <button type="button" class="btn" data-region="apac" aria-pressed="false">Asia-Pacific</button>
  <button type="button" class="btn" data-region="cis" aria-pressed="false">CIS</button>
</div>

{%- assign mail_subject = "Open Identity Platform commercial support enquiry" | uri_escape -%}
<div class="row g-4 mb-4" id="vendor-grid">
  {% for v in site.data.vendors %}
  <div class="col-md-6 col-lg-3 vendor-col" data-region="{{ v.region | escape }}">
    <div class="card h-100">
      <div class="card-body d-flex flex-column">
        <span class="region-badge mb-2">{{ v.region_label | escape }}</span>
        <h3 class="h5 card-title">{{ v.name | escape }}</h3>
        <ul class="vendor-facts list-unstyled">
          <li><i class="fa-solid fa-location-dot me-2"></i>{{ v.country | escape }}</li>
          <li><i class="fa-solid fa-language me-2"></i>{{ v.languages | escape }}</li>
        </ul>
        <div class="mt-auto">
          <a class="btn btn-support w-100 mb-2"
             href="mailto:{{ v.email | escape }}?subject={{ mail_subject }}"
             data-ga-event="generate_lead" data-ga-vendor="{{ v.slug | escape }}" data-ga-region="{{ v.region | escape }}">
            <i class="fa-solid fa-envelope me-2"></i>Email {{ v.name | escape }}
          </a>
          <a class="btn btn-outline-secondary w-100" href="{{ v.website | escape }}" target="_blank" rel="noopener">
            <i class="fa-solid fa-globe me-2"></i>Visit website
          </a>
        </div>
      </div>
    </div>
  </div>
  {% endfor %}
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

<script>
(function () {
  // Region filter — toggles cards; never reorders.
  var buttons = document.querySelectorAll('.region-filter .btn');
  var cols = document.querySelectorAll('.vendor-col');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var region = btn.getAttribute('data-region');
      buttons.forEach(function (b) {
        var selected = b === btn;
        b.classList.toggle('active', selected);
        b.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
      cols.forEach(function (col) {
        var show = region === 'all' || col.getAttribute('data-region') === region;
        col.classList.toggle('d-none', !show);
      });
    });
  });

  // Timezone hint — flags the vendor whose HQ region matches the visitor's timezone.
  // A hint only: it never hides or reorders anything.
  try {
    var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    var prefix = tz.split('/')[0];
    var map = { 'Europe': 'europe', 'America': 'americas', 'Asia': 'apac', 'Australia': 'apac', 'Pacific': 'apac' };
    var region = map[prefix];
    // CIS zones report under Europe/Asia prefixes; refine the common ones.
    if (/Moscow|Kaliningrad|Samara|Volgograd|Saratov|Astrakhan|Yekaterinburg|Minsk|Kyiv|Kiev|Simferopol/.test(tz)) {
      region = 'cis';
    }
    if (region) {
      document.querySelectorAll('.vendor-col[data-region="' + region + '"] .card-body').forEach(function (body) {
        var ribbon = document.createElement('div');
        ribbon.className = 'vendor-tz-ribbon';
        ribbon.textContent = 'Closest to your timezone';
        body.insertBefore(ribbon, body.firstChild);
      });
    }
  } catch (e) { /* timezone hint is best-effort */ }
})();
</script>
