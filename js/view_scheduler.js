window.Views.scheduler = (params = {}) => {
    UI.title.innerText = 'ตารางจัดเวร';
    let aff = params.affiliation || DB.getDefaultAffiliation();
    
    if (params.startFresh || !currentDraftData) {
        const selectedList = DB.data.draftSelection.map(id => DB.data.personnel.find(p => p.id === id)).filter(x=>x);
        currentDraftData = { id: null, date: new Date().toISOString().split('T')[0], assignments: {}, pool: [] };
        
        let currentPersonIdx = 0;
        aff.points.forEach(pt => {
            currentDraftData.assignments[pt.id] = [];
            if(pt.capacity !== 999) {
                while(currentDraftData.assignments[pt.id].length < pt.capacity && currentPersonIdx < selectedList.length) {
                    currentDraftData.assignments[pt.id].push(selectedList[currentPersonIdx]);
                    currentPersonIdx++;
                }
            }
        });
        while(currentPersonIdx < selectedList.length) { currentDraftData.pool.push(selectedList[currentPersonIdx]); currentPersonIdx++; }
    }

    const checkValidity = () => !aff.points.some(pt => pt.capacity !== 999 && (currentDraftData.assignments[pt.id]?.length || 0) > pt.capacity);

    const renderGrid = () => {
        let html = `
        <div class="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <div class="flex items-center gap-2"><label class="font-bold">วันที่:</label><input type="date" id="sch_date" value="${currentDraftData.date}" class="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"></div>
            <div class="flex gap-2"><button id="btn-random" class="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700"><i class="fas fa-dice mr-2"></i>สุ่มจัดคน</button><button id="btn-save-sch" class="bg-primary text-white px-6 py-2 rounded shadow hover:bg-indigo-600 disabled:opacity-50" ${checkValidity()?'':'disabled'}><i class="fas fa-save mr-2"></i>บันทึก</button></div>
        </div>
        <div class="flex flex-col lg:flex-row gap-4"><div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        `;

        // วาดจุดเข้าเวรพร้อมสี
        aff.points.forEach(pt => {
            const persons = currentDraftData.assignments[pt.id] || [];
            const countText = pt.capacity === 999 ? `${persons.length} คน` : `${persons.length}/${pt.capacity}`;
            const bColor = pt.color || '#4f46e5';
            
            html += `
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border-t-4" style="border-top-color: ${bColor};">
                <div class="flex justify-between items-center mb-3 border-b pb-2 dark:border-gray-700"><h3 class="font-bold text-lg">${pt.name}</h3><span class="text-sm text-gray-500">${countText}</span></div>
                <div class="dropzone space-y-2 min-h-[50px]" data-point-id="${pt.id}">
                    ${persons.map((p, idx) => `<div class="draggable bg-gray-50 dark:bg-gray-700 p-2 rounded border border-gray-200 flex justify-between items-center shadow-sm cursor-move" data-person-id="${p.id}"><div><span class="text-xs font-bold text-gray-400 mr-2">${idx+1}.</span>${p.rank} ${p.firstName} ${p.lastName}</div><div class="text-xs text-gray-500 text-right">รุ่น ${p.batch}<br>PX ${p.px}</div></div>`).join('')}
                </div>
            </div>`;
        });

        html += `</div>
            <div class="lg:w-80 bg-white dark:bg-gray-800 rounded-xl shadow p-4 border-t-4 border-gray-400 flex flex-col">
                <div class="flex justify-between items-center border-b pb-2 dark:border-gray-700 mb-3"><h3 class="font-bold text-lg">รายชื่อรอจัด <span class="text-primary text-sm">(${currentDraftData.pool.length})</span></h3><button id="btn-add-more" class="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 px-2 py-1 rounded"><i class="fas fa-plus"></i> เพิ่ม</button></div>
                <div class="dropzone space-y-2 flex-1 min-h-[200px]" data-point-id="pool">
                    ${currentDraftData.pool.map(p => `<div class="draggable bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded border border-indigo-200 flex justify-between items-center shadow-sm cursor-move" data-person-id="${p.id}"><div>${p.rank} ${p.firstName} ${p.lastName}</div><div class="text-xs text-indigo-500">รุ่น ${p.batch}</div></div>`).join('')}
                </div>
            </div>
        </div>`;
        UI.container.innerHTML = html;

        document.querySelectorAll('.dropzone').forEach(dz => new Sortable(dz, { group: 'shared', animation: 150, onEnd: () => {
            const newAssignments = {}; let newPool = [];
            aff.points.forEach(pt => {
                newAssignments[pt.id] = Array.from(document.querySelector(`.dropzone[data-point-id="${pt.id}"]`).querySelectorAll('.draggable')).map(el => DB.data.personnel.find(x => x.id === el.dataset.personId)).filter(x=>x);
            });
            newPool = Array.from(document.querySelector(`.dropzone[data-point-id="pool"]`).querySelectorAll('.draggable')).map(el => DB.data.personnel.find(x => x.id === el.dataset.personId)).filter(x=>x);
            currentDraftData.assignments = newAssignments; currentDraftData.pool = newPool;
            renderGrid();
        }}));

        // ปุ่มเพิ่มรายชื่อในรอจัด
        document.getElementById('btn-add-more').onclick = () => {
            let allIds = currentDraftData.pool.map(p => p.id);
            aff.points.forEach(pt => (currentDraftData.assignments[pt.id]||[]).forEach(p => allIds.push(p.id)));
            DB.data.draftSelection = allIds; DB.save();
            UI.navigate('selectPersonnel');
        };
        
        document.getElementById('btn-save-sch').onclick = () => {
            UI.confirm('บันทึกตารางเวร', `ตารางเวรวันที่ ${Utils.formatDate(currentDraftData.date)} จะถูกบันทึกลงประวัติ`, () => {
                if(currentDraftData.id) {
                    DB.data.schedules = DB.data.schedules.filter(s => s.id !== currentDraftData.id);
                }
                const newRecord = { id: currentDraftData.id || Utils.generateId(), date: currentDraftData.date, affiliation: JSON.parse(JSON.stringify(aff)), assignments: currentDraftData.assignments, timestamp: Date.now() };
                DB.data.schedules.push(newRecord);
                DB.data.draftSelection = []; DB.save(); currentDraftData = null;
                UI.navigate('historyView', { recordId: newRecord.id });
            });
        };
    };
    renderGrid();
};
