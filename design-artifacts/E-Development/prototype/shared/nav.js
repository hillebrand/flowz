// Flowz — Navigation Drawer
// Injects a side nav drawer + bottom bar into every page

const _NAV_ICONS = {
  today:           `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>`,
  tasks:           `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>`,
  done:            `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/></svg>`,
  magister:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M12 3v13M7 11l5 5 5-5M3 21h18"/></svg>`,
  availability:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m10 15 2 2 4-4"/></svg>`,
  settings:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2" fill="white"/><circle cx="16" cy="12" r="2" fill="white"/><circle cx="8" cy="18" r="2" fill="white"/></svg>`,
};

function injectNav(activePage) {
  const link = (page, active, icon, label) =>
    `<a href="${page}" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors ${active ? 'bg-gray-100 text-gray-900 font-medium' : ''}">${icon} ${label}</a>`;

  const navHTML = `
    <div id="nav-overlay" class="fixed inset-0 bg-black/40 z-40 hidden" onclick="closeNav()"></div>
    <nav id="nav-drawer" class="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl transform -translate-x-full transition-transform duration-300">
      <div class="p-6 border-b border-gray-100">
        <span class="font-bold text-xl text-gray-900">Flowz</span>
      </div>
      <ul class="p-4 space-y-1">
        <li>${link('02.1-energie-check-in.html',   activePage==='checkin',      _NAV_ICONS.today,        'Vandaag')}</li>
        <li>${link('01.5-takenoverzicht.html',      activePage==='tasks',        _NAV_ICONS.tasks,        'Alle taken')}</li>
        <li>${link('05.1-afgeronde-taken.html',     activePage==='done',         _NAV_ICONS.done,         'Afgerond')}</li>
        <li>${link('01.2-magister-sync.html',       activePage==='magister',     _NAV_ICONS.magister,     'Magister importeren')}</li>
        <li>${link('04.2-beschikbaarheid.html',     activePage==='availability', _NAV_ICONS.availability, 'Beschikbaarheid')}</li>
        <li>${link('04.1-instellingen.html',        activePage==='settings',     _NAV_ICONS.settings,     'Instellingen')}</li>
      </ul>
    </nav>
  `;
  document.body.insertAdjacentHTML('afterbegin', navHTML);
}

function openNav() {
  document.getElementById('nav-drawer').classList.remove('-translate-x-full');
  document.getElementById('nav-overlay').classList.remove('hidden');
}

function closeNav() {
  document.getElementById('nav-drawer').classList.add('-translate-x-full');
  document.getElementById('nav-overlay').classList.add('hidden');
}

window.injectNav = injectNav;
window.openNav = openNav;
window.closeNav = closeNav;
