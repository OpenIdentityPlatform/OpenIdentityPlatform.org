---
layout: home
landing: true
landing-title: "Welcome to Open Identity Platform Community"
landing-title2: "Open-source community organization, hosted on <a target=\"_blank\" href=\"https://github.com/OpenIdentityPlatform\">GitHub</a>"
landing-title3: "We develop and support Single Sign-On, Access Management, Identity Management, User-Managed Access, Directory Services, and Identity Gateway, designed and built as a single, unified platform"

canonical: "https://www.openidentityplatform.org"
---

<!-- Hero Section -->
<section class="hero pt-32 pb-24">
    <div class="hero-bg"></div>
    <div class="hero-content max-w-7xl mx-auto px-6">
        <div class="grid md:grid-cols-2 gap-12 items-center">
            <div class="space-y-6">
                <h1 class="hero-title leading-tight">
                    Open Identity Platform
                </h1>
                <h2 class="text-3xl font-bold text-gray-200">
                    Secure, Open-Source Identity & Access Management
                </h2>
                <p class="text-2xl text-gray-200 leading-relaxed">
                    Complete open-source ecosystem for <span class="code-accent">identity</span> and <span class="code-accent">access management</span>. Build secure, scalable authentication with enterprise-grade components.
                </p>
                <div class="flex flex-wrap gap-4 pt-4">
                    <a href="#products" class="btn-primary">
                        Explore Projects
                    </a>
                    <a href="https://github.com/OpenIdentityPlatform" target="_blank" class="btn-secondary">
                        View on GitHub
                    </a>
                    <button onclick="openModal()" class="btn-secondary">
                        Get Support
                    </button>
                </div>
            </div>
            <div class="md:block">
                <div class="relative">
                    <div class="w-full h-96 bg-white rounded-2xl backdrop-blur-sm border border-indigo-500/30 flex items-center justify-center">
                        <a class="oip-star-link">
                            <div class="oip-star"></div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Products Section -->
<section id="products" class="pt-24 relative">
    <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16 fade-in">
            <h2 class="text-5xl font-bold mb-4">Our Products</h2>
            <p class="text-xl text-gray-400">Enterprise-grade identity management components</p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- OpenAM -->
            <div class="product-card fade-in">
                <h3 class="text-2xl font-bold mb-3">OpenAM</h3>
                <p class="text-gray-400 mb-4">Comprehensive access management solution with SSO, federation, and authorization services. Battle-tested for enterprise environments.</p>
                <a href="https://github.com/OpenIdentityPlatform/OpenAM" target="_blank" class="code-accent hover:underline">Learn more →</a>
            </div>
            <!-- OpenDJ -->
            <div class="product-card fade-in" style="animation-delay: 0.1s;">
                <h3 class="text-2xl font-bold mb-3">OpenDJ</h3>
                <p class="text-gray-400 mb-4">High-performance LDAP directory server designed for identity data. Scales to millions of entries with ease.</p>
                <a href="https://github.com/OpenIdentityPlatform/OpenDJ" target="_blank" class="code-accent hover:underline">Learn more →</a>
            </div>
            <!-- OpenIG -->
            <div class="product-card fade-in" style="animation-delay: 0.2s;">
                <h3 class="text-2xl font-bold mb-3">OpenIG</h3>
                <p class="text-gray-400 mb-4">Identity gateway for secure access to web applications. Provides authentication, authorization, and federation capabilities.</p>
                <a href="https://github.com/OpenIdentityPlatform/OpenIG" target="_blank" class="code-accent hover:underline">Learn more →</a>
            </div>
            <!-- OpenIDM -->
            <div class="product-card fade-in" style="animation-delay: 0.3s;">
                <h3 class="text-2xl font-bold mb-3">OpenIDM</h3>
                <p class="text-gray-400 mb-4">Identity management and provisioning solution. Automate user lifecycle management across your organization.</p>
                <a href="https://github.com/OpenIdentityPlatform/OpenIDM" target="_blank" class="code-accent hover:underline">Learn more →</a>
            </div>
            <!-- OpenICF -->
            <div class="product-card fade-in" style="animation-delay: 0.4s;">
                <h3 class="text-2xl font-bold mb-3">OpenICF</h3>
                <p class="text-gray-400 mb-4">Identity connector framework for seamless integration. Connect to any identity repository or target system.</p>
                <a href="https://github.com/OpenIdentityPlatform/OpenICF" target="_blank" class="code-accent hover:underline">Learn more →</a>
            </div>
        </div>
    </div>
</section>

<!-- Blog Section -->
<section id="blog" class="pt-24 bg-gradient-to-b from-transparent to-slate-900/30">
    <div class="max-w-5xl mx-auto px-6">
        <div class="text-center mb-16 fade-in">
            <h2 class="text-5xl font-bold mb-4">Recent Blog Posts</h2>
            <p class="text-xl text-gray-400">Latest updates from the community</p>
        </div>
        <div class="space-y-6">
            {% for post in site.posts limit:4%}
             <a class="blogpost" href="{{post.url}}">
            <article class="blog-post fade-in">
                <div class="flex items-start justify-between">
                    <div>
                        <h3 class="text-xl font-bold mb-2">{%- if post.landing-title -%} {{ post.landing-title }} {%- else -%}{{ post.title}}{%- endif -%}</h3>
                        <p class="text-gray-400 mb-2">{{post.description}}</p>
                        <span class="text-sm code-accent">{{post.date |  date: "%d.%m.%Y" }}</span>
                    </div>
                </div>
            </article>
            </a>
            {% endfor %}
        </div>
        <div class="text-center mt-12">
            <a href="/blog/" class="btn-secondary">
                View All Posts
            </a>
        </div>
    </div>
</section>

<!-- Open Source License Section -->
<section id="license" class="pt-24">
    <div class="max-w-5xl mx-auto px-6 text-center">
        <div class="fade-in">
            <span class="license-badge">100% OPEN SOURCE</span>
            <h2 class="text-5xl font-bold mb-6">Free & Open License</h2>
            <p class="text-xl text-gray-400 leading-relaxed mb-8">
                All Open Identity Platform projects are released under the <span class="code-accent">CDDL-1.0</span> license. 
                Use, modify, and distribute freely in your commercial or open-source projects. No vendor lock-in, no hidden costs.
            </p>
            <div id="clone-code" class="inline-block bg-slate-900/50 border border-indigo-500/30 rounded-lg p-6 text-left">
                <p class="font-mono text-sm text-gray-300">
                    <span class="text-indigo-400">$</span> git clone https://github.com/OpenIdentityPlatform/OpenAM.git<br>
                    <span class="text-indigo-400">$</span> # Build, deploy, customize - it's yours!
                </p>
            </div>
        </div>
    </div>
</section>

<!-- Community & Support CTA -->
<section class="py-24 bg-gradient-to-b from-slate-900/30 to-transparent">
    <div class="max-w-5xl mx-auto px-6">
        <div class="cta-section fade-in">
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold mb-4">Join the Community</h2>
                <p class="text-xl text-gray-400">
                    Connect with developers, get support, and collaborate on the future of IAM
                </p>
            </div>
            
            <div class="grid md:grid-cols-2 gap-8">
                <!-- Community Support -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-8 transition-all hover:border-primary">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                            </svg>
                        </div>
                        <h3 class="text-2xl font-bold">Community Support</h3>
                    </div>
                    <p class="text-gray-400 mb-6">
                        Join our active community for free support, discussions, and collaboration. Share ideas, troubleshoot issues, and contribute code.
                    </p>
                    <a href="https://github.com/orgs/OpenIdentityPlatform/discussions" target="_blank" class="btn-primary w-full text-center block">
                        Join GitHub Discussions
                    </a>
                </div>
                
                <!-- Commercial Support -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-8 transition-all hover:border-primary">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-4">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <h3 class="text-2xl font-bold">Commercial Support</h3>
                    </div>
                    <p class="text-gray-400 mb-6">
                        Get professional assistance, consulting, and enterprise support for your deployment. Professional services for migration and custom integrations.
                    </p>
                    <a href="https://github.com/OpenIdentityPlatform/.github/wiki/Approved-Vendor-List" target="_blank" class="btn-primary w-full text-center block">
                        Approved Vendors
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>