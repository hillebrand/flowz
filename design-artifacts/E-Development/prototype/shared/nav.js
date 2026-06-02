// Flowz — Navigation Drawer
// Injects a side nav drawer + bottom bar into every page

function injectNav(activePage) {
  const navHTML = `
    <!-- Side Nav Overlay -->
    <div id="nav-overlay" class="fixed inset-0 bg-black/40 z-40 hidden" onclick="closeNav()"></div>

    <!-- Side Nav Drawer -->
    <nav id="nav-drawer" class="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl transform -translate-x-full transition-transform duration-300">
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center">
          <img src="../assets/logo-light.svg" alt="Flowz" class="h-8 w-auto">
        </div>
      </div>
      <ul class="p-4 space-y-1">
        <li>
          <a href="02.1-energie-check-in.html"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${activePage === 'checkin' ? 'bg-indigo-50 text-indigo-700 font-medium' : ''}">
            <span>⚡</span> Vandaag
          </a>
        </li>
        <li>
          <a href="01.5-takenoverzicht.html"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${activePage === 'tasks' ? 'bg-indigo-50 text-indigo-700 font-medium' : ''}">
            <span>📋</span> Alle taken
          </a>
        </li>
        <li>
          <a href="03.2-voortgang.html"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${activePage === 'progress' ? 'bg-indigo-50 text-indigo-700 font-medium' : ''}">
            <span>📈</span> Voortgang
          </a>
        </li>
        <li>
          <a href="05.1-afgeronde-taken.html"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${activePage === 'done' ? 'bg-indigo-50 text-indigo-700 font-medium' : ''}">
            <span>✓</span> Afgerond
          </a>
        </li>
        <li>
          <a href="01.2-magister-sync.html"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${activePage === 'magister' ? 'bg-indigo-50 text-indigo-700 font-medium' : ''}">
            <span>📚</span> Magister importeren
          </a>
        </li>
        <li>
          <a href="04.1-instellingen.html"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${activePage === 'settings' ? 'bg-indigo-50 text-indigo-700 font-medium' : ''}">
            <span>⚙️</span> Instellingen
          </a>
        </li>
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
