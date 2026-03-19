---
layout: default
title: Leadgen Events Namespace
namespace: leadgen-events
---

<div class="container" style="padding-top: var(--space-8); padding-bottom: var(--space-20);">
  <!-- Breadcrumbs -->
  <nav style="margin-bottom: var(--space-6); font-size: var(--hr-font-size-sm); color: var(--text-muted);">
    <a href="{{ '/' | relative_url }}" style="color: var(--accent); text-decoration: none;">Home</a>
    <span style="margin: 0 var(--space-2);">›</span>
    <span style="color: var(--text-default);">Leadgen Events</span>
  </nav>

  <!-- Namespace Header -->
  <header style="margin-bottom: var(--space-12); padding-bottom: var(--space-6); border-bottom: 1px solid var(--border-default);">
    <div style="display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-4);">
      <div style="font-size: 48px;">📧</div>
      <h1 style="font-size: var(--hr-font-size-display-md); font-weight: var(--hr-font-weight-bold); color: var(--text-heading);">Leadgen Events Namespace</h1>
    </div>
    <p style="font-size: var(--hr-font-size-xl); color: var(--text-secondary); max-width: 800px;">
      Lead generation event infrastructure, email campaigns, form submissions, and webhook integrations.
    </p>
  </header>

  <!-- Artifacts by Author -->
  <section>
    <h2 style="font-size: var(--hr-font-size-display-xs); font-weight: var(--hr-font-weight-bold); color: var(--text-heading); margin-bottom: var(--space-6);">
      📚 Artifacts
    </h2>

    {% assign leadgen_artifacts = site.pages | where_exp: "page", "page.namespace == 'leadgen-events'" | where_exp: "page", "page.layout == 'artifact'" | sort: "date" | reverse %}

    {% if leadgen_artifacts.size > 0 %}
      <div style="display: grid; gap: var(--space-4);">
        {% for artifact in leadgen_artifacts %}
        <a href="{{ artifact.url | relative_url }}" style="text-decoration: none; background: var(--card-bg); border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: var(--space-5); display: block; transition: all var(--transition-base);"
           onmouseover="this.style.borderColor='var(--accent)'; this.style.background='var(--hover-bg)'; this.style.transform='translateX(4px)';"
           onmouseout="this.style.borderColor='var(--border-default)'; this.style.background='var(--card-bg)'; this.style.transform='translateX(0)';">

          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-2);">
            <h3 style="font-size: var(--hr-font-size-xl); font-weight: var(--hr-font-weight-semibold); color: var(--text-heading); margin: 0;">
              {{ artifact.title }}
            </h3>
            <span class="badge badge-primary" style="text-transform: uppercase; flex-shrink: 0;">{{ artifact.type }}</span>
          </div>

          <div style="display: flex; gap: var(--space-4); font-size: var(--hr-font-size-sm); color: var(--text-muted); flex-wrap: wrap;">
            <span>👤 {{ artifact.author }}</span>
            <span>📅 {{ artifact.date | date: "%Y-%m-%d" }}</span>
            {% if artifact.status %}
            <span>
              {% if artifact.status == 'complete' %}
                ✅ Complete
              {% elsif artifact.status == 'in_progress' %}
                🔄 In Progress
              {% else %}
                {{ artifact.status }}
              {% endif %}
            </span>
            {% endif %}
          </div>

          {% if artifact.tags and artifact.tags.size > 0 %}
          <div style="display: flex; gap: var(--space-2); margin-top: var(--space-3); flex-wrap: wrap;">
            {% for tag in artifact.tags limit:5 %}
            <span style="background: var(--subtle-bg); color: var(--text-secondary); padding: 2px var(--space-2); border-radius: var(--radius-sm); font-size: var(--hr-font-size-xs);">
              #{{ tag }}
            </span>
            {% endfor %}
          </div>
          {% endif %}
        </a>
        {% endfor %}
      </div>
    {% else %}
      <p style="text-align: center; padding: var(--space-12); color: var(--text-muted);">
        No artifacts published yet in the Leadgen Events namespace.
      </p>
    {% endif %}
  </section>
</div>
