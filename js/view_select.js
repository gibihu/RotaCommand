window.Views.selectPersonnel = () => {
    UI.title.innerText = 'เลือกกำลังพลจัดเวร';
    let selectedIds = new Set(DB.data.draftSelection || []);
    let searchQuery = '';
    let filterBatch = '';
    const getBatches = () => [...new Set(DB.data.personnel.filter(p => !p.isDeleted).map(p => p.batch))].sort();

    // วาดโครงสร้างหลักรอบเดียว
    UI.container.innerHTML = `
        <div class="mb-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow space-y-4">
            <div class="flex flex-wrap gap-4">
                <div class="flex-1 min-w-[200px]"><input type="text" id="s_search" placeholder="ค้นหา ชื่อ, นามสกุล, PX..." class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"></div>
                <div class="w-48"><select id="s_batch" class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"></select></div>
            </div>
            <div class="flex justify-between items-center"><span id="txt-selected-count" class="font-bold text-primary">เลือกแล้ว: ${selectedIds.size} คน</span><div class="space-x-2"><button id="btn-clear-sel" class="text-gray-500 hover:text-danger px-3 py-1"><i class="fas fa-broom mr-1"></i>ล้าง</button><button id="btn-confirm-sel" class="bg-primary text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-600 transition">จัดเวร <i class="fas fa-arrow-right ml-1"></i></button></div></div>
        </div>
        <div id="sel-table-container" class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden"></div>
    `;

    const sBatch = document.getElementById('s_batch');
    let opts = '<option value="">ทั้งหมด (รุ่น)</option>';
    getBatches().forEach(b => opts += `<option value="${b}">${b}</option>`);
    sBatch.innerHTML = opts;

    const renderTableOnly = () => {
        let list = DB.data.personnel.filter(p => !p.isDeleted);
        if (filterBatch) list = list.filter(p => p.batch === filterBatch);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            list = list.filter(p => p.firstName.toLowerCase().includes(q) || p.lastName.toLowerCase().includes(q) || String(p.px).includes(q));
        }

        let html = `<div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead class="bg-gray-100 dark:bg-gray-700"><tr><th class="p-3 border-b dark:border-gray-600 w-12 text-center">เลือก</th><th class="p-3 border-b dark:border-gray-600">ยศ ชื่อ นามสกุล</th><th class="p-3 border-b dark:border-gray-600">รุ่น</th><th class="p-3 border-b dark:border-gray-600">PX</th><th class="p-3 border-b dark:border-gray-600">เข้าเวร</th></tr></thead><tbody>`;
        if (list.length === 0) html += `<tr><td colspan="5" class="p-6 text-center text-gray-500">ไม่พบรายชื่อ</td></tr>`;
        else {
            list.forEach(p => {
                const isChecked = selectedIds.has(p.id) ? 'checked' : '';
                html += `<tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer" onclick="toggleSel('${p.id}')"><td class="p-3 border-b dark:border-gray-600 text-center"><input type="checkbox" id="chk_${p.id}" ${isChecked} class="w-5 h-5 text-primary rounded focus:ring-primary cursor-pointer" onclick="event.stopPropagation(); toggleSel('${p.id}')"></td><td class="p-3 border-b dark:border-gray-600">${p.rank} ${p.firstName} ${p.lastName}</td><td class="p-3 border-b dark:border-gray-600">${p.batch}</td><td class="p-3 border-b dark:border-gray-600">${p.px}</td><td class="p-3 border-b dark:border-gray-600">${p.shiftCount} ครั้ง</td></tr>`;
            });
        }
        html += `</tbody></table></div>`;
        document.getElementById('sel-table-container').innerHTML = html;
        document.getElementById('txt-selected-count').innerText = `เลือกแล้ว: ${selectedIds.size} คน`;
    };

    window.toggleSel = (id) => {
        if(selectedIds.has(id)) selectedIds.delete(id); else selectedIds.add(id);
        DB.data.draftSelection = Array.from(selectedIds); DB.save();
        const chk = document.getElementById('chk_' + id); if(chk) chk.checked = selectedIds.has(id);
        document.getElementById('txt-selected-count').innerText = `เลือกแล้ว: ${selectedIds.size} คน`;
    };

    document.getElementById('s_search').addEventListener('input', (e) => { searchQuery = e.target.value; renderTableOnly(); });
    document.getElementById('s_batch').addEventListener('change', (e) => { filterBatch = e.target.value; renderTableOnly(); });
    
    document.getElementById('btn-clear-sel').onclick = () => { selectedIds.clear(); DB.data.draftSelection = []; DB.save(); renderTableOnly(); };
    
    document.getElementById('btn-confirm-sel').onclick = () => {
        if (selectedIds.size === 0) return UI.alert('แจ้งเตือน', 'กรุณาเลือกกำลังพลอย่างน้อย 1 นาย');
        UI.navigate('scheduler', { startFresh: true });
    };

    renderTableOnly();
};
