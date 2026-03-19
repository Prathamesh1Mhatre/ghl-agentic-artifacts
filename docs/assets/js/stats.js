/**
 * GHL Agentic Artifacts Registry - Stats Dashboard
 * Auto-counts artifacts across namespaces and updates dashboard
 */

(function() {
  'use strict';

  const NAMESPACES = ['platform', 'leadgen-events', 'revex-courses', 'crm', 'automation', 'mobile'];
  const ARTIFACT_TYPES = ['research', 'specs', 'designs', 'plans', 'reviews', 'learnings', 'runs'];

  /**
   * Count artifacts in a namespace by scanning directory structure
   */
  async function countNamespaceArtifacts(namespace) {
    try {
      const response = await fetch(`/.aw_docs/${namespace}/index.json`);
      if (!response.ok) return 0;
      const data = await response.json();
      return data.total_artifacts || 0;
    } catch (error) {
      // Namespace doesn't exist yet or no index.json
      return 0;
    }
  }

  /**
   * Get unique contributors across all namespaces
   */
  async function countContributors() {
    const contributors = new Set();

    for (const namespace of NAMESPACES) {
      try {
        const response = await fetch(`/.aw_docs/${namespace}/index.json`);
        if (!response.ok) continue;
        const data = await response.json();
        if (data.contributors) {
          data.contributors.forEach(c => contributors.add(c));
        }
      } catch (error) {
        continue;
      }
    }

    return contributors.size;
  }

  /**
   * Get last update timestamp across all artifacts
   */
  async function getLastUpdated() {
    let latestDate = null;

    for (const namespace of NAMESPACES) {
      try {
        const response = await fetch(`/.aw_docs/${namespace}/index.json`);
        if (!response.ok) continue;
        const data = await response.json();
        if (data.last_updated) {
          const date = new Date(data.last_updated);
          if (!latestDate || date > latestDate) {
            latestDate = date;
          }
        }
      } catch (error) {
        continue;
      }
    }

    if (!latestDate) return 'Never';

    const now = new Date();
    const diffMs = now - latestDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return latestDate.toLocaleDateString();
  }

  /**
   * Update all dashboard stats
   */
  async function updateStats() {
    let totalArtifacts = 0;
    const counts = {};

    // Count artifacts per namespace
    for (const namespace of NAMESPACES) {
      const count = await countNamespaceArtifacts(namespace);
      counts[namespace] = count;
      totalArtifacts += count;

      // Update namespace card count
      const countElement = document.getElementById(`${namespace}-count`);
      if (countElement) {
        countElement.textContent = count;
      }
    }

    // Update global stats
    const totalElement = document.getElementById('totalArtifacts');
    if (totalElement) {
      totalElement.textContent = totalArtifacts;
    }

    const contributorsElement = document.getElementById('totalContributors');
    if (contributorsElement) {
      const contributorCount = await countContributors();
      contributorsElement.textContent = contributorCount;
    }

    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
      const lastUpdated = await getLastUpdated();
      lastUpdatedElement.textContent = lastUpdated;
    }

    // Count active namespaces (those with artifacts)
    const activeNamespaces = Object.values(counts).filter(c => c > 0).length;
    const namespacesElement = document.getElementById('totalNamespaces');
    if (namespacesElement) {
      namespacesElement.textContent = activeNamespaces;
    }
  }

  /**
   * Load recent artifacts feed
   */
  async function loadRecentArtifacts() {
    const recentContainer = document.getElementById('recentArtifacts');
    if (!recentContainer) return;

    const allArtifacts = [];

    // Fetch recent artifacts from each namespace
    for (const namespace of NAMESPACES) {
      try {
        const response = await fetch(`/.aw_docs/${namespace}/recent.json`);
        if (!response.ok) continue;
        const data = await response.json();
        if (data.artifacts) {
          allArtifacts.push(...data.artifacts.map(a => ({ ...a, namespace })));
        }
      } catch (error) {
        continue;
      }
    }

    if (allArtifacts.length === 0) {
      recentContainer.innerHTML = `
        <p style="color: var(--text-secondary); text-align: center; padding: var(--spacing-xl);">
          No artifacts published yet. Start by running <code>aw publish</code> in your workspace.
        </p>
      `;
      return;
    }

    // Sort by date and take top 10
    allArtifacts.sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentArtifacts = allArtifacts.slice(0, 10);

    // Render artifact list
    const html = recentArtifacts.map(artifact => `
      <div class="artifact-item">
        <a href="${artifact.url}" class="artifact-title">${artifact.title}</a>
        <div class="artifact-meta">
          <span>${artifact.namespace}</span>
          <span>${artifact.author}</span>
          <span>${artifact.type}</span>
          <span>${new Date(artifact.date).toLocaleDateString()}</span>
        </div>
      </div>
    `).join('');

    recentContainer.innerHTML = html;
  }

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      updateStats();
      loadRecentArtifacts();
    });
  } else {
    updateStats();
    loadRecentArtifacts();
  }
})();
