// FlowState — Custom Modal Utility
// Replaces native browser prompt() / confirm() with styled bottom-sheet modals

(function injectStyles() {
  if (document.getElementById('fs-modal-styles')) return;
  const style = document.createElement('style');
  style.id = 'fs-modal-styles';
  style.textContent = `
    @keyframes fs-fadeIn  { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fs-slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    #fs-modal-container .fs-backdrop { animation: fs-fadeIn  0.15s ease forwards; }
    #fs-modal-container .fs-sheet    { animation: fs-slideUp 0.2s ease forwards; }
  `;
  document.head.appendChild(style);
})();

function _getOrCreateContainer() {
  let el = document.getElementById('fs-modal-container');
  if (!el) {
    el = document.createElement('div');
    el.id = 'fs-modal-container';
    document.body.appendChild(el);
  }
  return el;
}

function _clear() {
  const el = document.getElementById('fs-modal-container');
  if (el) el.innerHTML = '';
}

// showConfirm — resolves true (confirm) or false (cancel)
function showConfirm(message, { confirmLabel = 'Bevestigen', cancelLabel = 'Annuleren', danger = false } = {}) {
  return new Promise(resolve => {
    const container = _getOrCreateContainer();
    const id = 'fsm-' + Date.now();
    const btnClass = danger
      ? 'bg-red-500 hover:bg-red-600 text-white'
      : 'bg-primary hover:bg-primary-dark text-white';

    container.innerHTML = `
      <div id="${id}-bd" class="fs-backdrop fixed inset-0 bg-black/50 z-50 flex items-end justify-center pb-6 px-4">
        <div class="fs-sheet bg-white rounded-3xl w-full max-w-sm shadow-xl px-6 pt-6 pb-5">
          <p class="text-sm text-gray-700 text-center leading-relaxed mb-6 whitespace-pre-line">${message}</p>
          <div class="flex flex-col gap-2">
            <button id="${id}-ok"
                    class="w-full font-semibold py-3.5 rounded-2xl text-sm transition-all active:scale-95 ${btnClass}">
              ${confirmLabel}
            </button>
            <button id="${id}-no"
                    class="w-full text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors">
              ${cancelLabel}
            </button>
          </div>
        </div>
      </div>`;

    const close = result => { _clear(); resolve(result); };
    document.getElementById(`${id}-ok`).onclick = () => close(true);
    document.getElementById(`${id}-no`).onclick = () => close(false);
    document.getElementById(`${id}-bd`).onclick = e => { if (e.target === e.currentTarget) close(false); };
  });
}

// showInput — resolves to trimmed string, or null if cancelled
function showInput(label, { placeholder = '', defaultValue = '', confirmLabel = 'Toevoegen' } = {}) {
  return new Promise(resolve => {
    const container = _getOrCreateContainer();
    const id = 'fsm-' + Date.now();

    container.innerHTML = `
      <div id="${id}-bd" class="fs-backdrop fixed inset-0 bg-black/50 z-50 flex items-end justify-center pb-6 px-4">
        <div class="fs-sheet bg-white rounded-3xl w-full max-w-sm shadow-xl px-6 pt-6 pb-5">
          <p class="text-sm font-medium text-gray-800 mb-3">${label}</p>
          <input id="${id}-inp" type="text" value="${defaultValue}" placeholder="${placeholder}"
                 class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary mb-4">
          <div class="flex flex-col gap-2">
            <button id="${id}-ok"
                    class="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-2xl text-sm transition-all active:scale-95">
              ${confirmLabel}
            </button>
            <button id="${id}-no"
                    class="w-full text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors">
              Annuleren
            </button>
          </div>
        </div>
      </div>`;

    const inputEl = document.getElementById(`${id}-inp`);

    const close = value => { _clear(); resolve(value); };

    document.getElementById(`${id}-ok`).onclick = () => {
      const val = inputEl.value.trim();
      if (!val) { inputEl.focus(); inputEl.classList.add('border-red-400'); return; }
      close(val);
    };
    document.getElementById(`${id}-no`).onclick = () => close(null);
    document.getElementById(`${id}-bd`).onclick = e => { if (e.target === e.currentTarget) close(null); };
    inputEl.onkeydown = e => { if (e.key === 'Enter') document.getElementById(`${id}-ok`).click(); };
    inputEl.oninput = () => inputEl.classList.remove('border-red-400');

    setTimeout(() => inputEl.focus(), 80);
  });
}

window.FS_Modal = { showConfirm, showInput };
