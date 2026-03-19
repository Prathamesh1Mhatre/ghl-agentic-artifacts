/**
 * GHL Agentic Artifacts Registry - Search Functionality
 * Client-side search with debouncing and namespace filtering
 */

(function() {
  'use strict';

  let searchIndex = null;
  let debounceTimer = null;

  /**
   * Build search index from all artifacts
   */
  async function buildSearchIndex() {
    const NAMESPACES = ['platform', 'leadgen-events', 'revex-courses', 'crm', 'automation', 'mobile'];
    const artifacts = [];

    for (const namespace of NAMESPACES) {
      try {
        const response = await fetch(`/.aw_docs/${namespace}/search-index.json`);
        if (!response.ok) continue;
        const data = await response.json();
        if (data.artifacts) {
          artifacts.push(...data.artifacts.map(a => ({ ...a, namespace })));
        }
      } catch (error) {
        continue;
      }
    }

    return artifacts;
  }

  /**
   * Simple client-side search
   */
  function searchArtifacts(query, artifacts) {
    if (!query || query.length < 2) return [];

    const lowerQuery = query.toLowerCase();
    const tokens = lowerQuery.split(/\s+/).filter(t => t.length > 0);

    return artifacts
      .map(artifact => {
        let score = 0;

        // Title match (highest weight)
        const titleMatch = tokens.filter(t => artifact.title.toLowerCase().includes(t)).length;
        score += titleMatch * 10;

        // Type match
        if (artifact.type && artifact.type.toLowerCase().includes(lowerQuery)) {
          score += 5;
        }

        // Author match
        if (artifact.author && artifact.author.toLowerCase().includes(lowerQuery)) {
          score += 3;
        }

        // Tag match
        if (artifact.tags) {
          const tagMatch = artifact.tags.filter(t => t.toLowerCase().includes(lowerQuery)).length;
          score += tagMatch * 2;
        }

        // Description match (if available)
        if (artifact.description) {
          const descMatch = tokens.filter(t => artifact.description.toLowerCase().includes(t)).length;
          score += descMatch;
        }

        return { artifact, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => item.artifact);
  }

  /**
   * Render search results
   */
  function renderSearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;

    if (results.length === 0) {
      resultsContainer.style.display = 'none';
      return;
    }

    const html = `
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: var(--spacing-md); max-height: 400px; overflow-y: auto;">
        <div style="margin-bottom: var(--spacing-sm); color: var(--text-tertiary); font-size: 0.875rem;">
          Found ${results.length} result${results.length === 1 ? '' : 's'}
        </div>
        ${results.map(artifact => `
          <a href="${artifact.url}" class="artifact-item" style="display: block; padding: var(--spacing-md); border-radius: var(--radius-sm); margin-bottom: var(--spacing-xs);">
            <div class="artifact-title">${artifact.title}</div>
            <div class="artifact-meta">
              <span>${artifact.namespace}</span>
              <span>${artifact.author}</span>
              <span>${artifact.type}</span>
              ${artifact.date ? `<span>${new Date(artifact.date).toLocaleDateString()}</span>` : ''}
            </div>
          </a>
        `).join('')}
      </div>
    `;

    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'block';
  }

  /**
   * Handle search input with debouncing
   */
  async function handleSearch(event) {
    const query = event.target.value.trim();

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Debounce search by 300ms
    debounceTimer = setTimeout(async () => {
      if (query.length < 2) {
        renderSearchResults([]);
        return;
      }

      // Build index on first search
      if (!searchIndex) {
        searchIndex = await buildSearchIndex();
      }

      const results = searchArtifacts(query, searchIndex);
      renderSearchResults(results);
    }, 300);
  }

  /**
   * Close search results when clicking outside
   */
  function handleClickOutside(event) {
    const searchBar = document.querySelector('.search-bar');
    const resultsContainer = document.getElementById('searchResults');

    if (resultsContainer && searchBar && !searchBar.contains(event.target) && !resultsContainer.contains(event.target)) {
      resultsContainer.style.display = 'none';
    }
  }

  /**
   * Initialize search functionality
   */
  function initSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', handleSearch);
    document.addEventListener('click', handleClickOutside);

    // Close results on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
          resultsContainer.style.display = 'none';
        }
      }
    });
  }

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
