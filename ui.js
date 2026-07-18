// ==========================================
// UI COMPONENTS (Modals & Alerts)
// ==========================================
const UI = {
    container: document.getElementById('app-content'),
    title: document.getElementById('app-title'),
    btnBack: document.getElementById('btn-back'),
    actions: document.getElementById('header-actions'),
    modals: document.getElementById('modals'),

    navigate: (viewName, params = null) => {
        currentView = viewName;
        UI.btnBack.classList.toggle('hidden', viewName === 'home');
        UI.actions.innerHTML = '';
        
        switch(viewName) {
            case 'home': Views.home(); break;
            case 'personnel': Views.personnel(); break;
            case 'selectPersonnel': Views.selectPersonnel(); break;
            case 'scheduler': Views.scheduler(params); break;
            case 'affiliations': Views.affiliations(); break;
            case 'history': Views.history(); break;
            case 'historyView': Views.historyView(params); break;
            case 'settings': Views.settings(); break;
        }
    },

    modalCounter: 0,
    showModal: (html, mId = null) => {
        UI.modalCounter++;
        const modalId = mId || 'modal-gen-' + UI.modalCounter;
        const zIndex = 50 + UI.modalCounter;
        const modalHtml = `
            <div id="${modalId}" class="fixed inset-0 modal-overlay flex items-center justify-center p-4 z-[${zIndex}]">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in scale-in">
                    ${html}
                </div>
            </div>
        `;
        UI.modals.insertAdjacentHTML('beforeend', modalHtml);
        return modalId;
    },
    closeModal: (id = null) => {
        if(id) {
            const m = document.getElementById(id);
            if(m) m.remove();
        } else {
            if (UI.modals.lastElementChild) UI.modals.lastElementChild.remove();
        }
    },

    confirm: (title, message, onConfirm, textConfirm = 'ยืนยัน', textCancel = 'ยกเลิก', danger = false) => {
        const mId = 'modal-confirm-' + Date.now();
        const btnClass = danger ? 'bg-danger hover:bg-red-600' : 'bg-primary hover:bg-indigo-600';
        UI.showModal(`
            <h3 class="text-xl font-bold mb-2">${title}</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">${message}</p>
            <div class="flex justify-end gap-3">
                <button onclick="UI.closeModal('${mId}')" class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">${textCancel}</button>
                <button id="btn-conf-${mId}" class="px-4 py-2 rounded-lg text-white ${btnClass} transition">${textConfirm}</button>
            </div>
        `, mId);
        document.getElementById(`btn-conf-${mId}`).onclick = () => { UI.closeModal(mId); onConfirm(); };
    },
    
    alert: (title, message) => {
        const mId = 'modal-alert-' + Date.now();
        UI.showModal(`
            <h3 class="text-xl font-bold mb-2">${title}</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">${message}</p>
            <div class="flex justify-end">
                <button onclick="UI.closeModal('${mId}')" class="px-4 py-2 rounded-lg bg-primary text-white transition">ตกลง</button>
            </div>
        `, mId);
    }
};

// ผูก Event กลับหน้าหลัก
UI.btnBack.onclick = () => { UI.navigate('home'); };
