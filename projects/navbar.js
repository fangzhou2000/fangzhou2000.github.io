(() => {
  // Add future projects here; every project page uses this same list.
  const projects = [
    { slug: 'drivingforward', title: 'DrivingForward' },
    { slug: 'fleg', title: 'FLEG' },
    { slug: 'v2w', title: 'V2W' },
  ];
  const base = new URL('./', document.currentScript.src);

  class ProjectNavbar extends HTMLElement {
    connectedCallback() {
      if (this.querySelector('nav')) return;
      const current = projects.find(project => {
        const path = new URL(`${project.slug}/`, base).pathname;
        return location.pathname === path.slice(0, -1) || location.pathname.startsWith(path);
      });
      this.innerHTML = `
        <nav class="project-nav" aria-label="Research projects">
          <a class="project-nav-home" href="${new URL('../index.html', base).href}" aria-label="Home">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 3 2 12h3v9h5v-6h4v6h5v-9h3L12 3Z"/></svg>
          </a>
          <details class="project-nav-menu">
            <summary>More Research${current ? ` <span class="project-nav-current">${current.title}</span>` : ''}</summary>
            <div class="project-nav-dropdown">
              ${projects.map(project => `<a class="project-nav-item${project === current ? ' is-current' : ''}" href="${new URL(`${project.slug}/index.html`, base).href}"${project === current ? ' aria-current="page"' : ''}>${project.title}${project === current ? '<span class="project-nav-note">Current</span>' : ''}</a>`).join('')}
            </div>
          </details>
        </nav>`;
      const menu = this.querySelector('details');
      this.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          menu.open = false;
          menu.querySelector('summary').focus();
        }
      });
      document.addEventListener('click', event => {
        if (!this.contains(event.target)) menu.open = false;
      });
    }
  }

  customElements.define('project-navbar', ProjectNavbar);
})();
