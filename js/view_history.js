window.Views.history = () => {
    UI.title.innerText = 'ประวัติการจัดเวร';
    let sortMode = 'latest'; // latest, date, oldest

    const renderHistory = () => {
        let sorted = [...DB.data.schedules];
        if(sortMode === 'latest') sorted.sort((a,b) => b.timestamp - a.timestamp);
        else if(sortMode === 'oldest') sorted.sort((a,b) => a.timestamp - b.timestamp);
        else if(sortMode === 'date') sorted.sort((a,b) => new Date(b.date) - new Date(a.date));

        let html = `
        <div class="mb-4 flex justify-end">
            <select id="sel-hist-sort" class="p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                <option value="latest" ${sortMode==='latest'?'selected':''}>เพิ่มล่าสุด</option>
                <option value="date" ${sortMode==='date'?'selected':''}>วันที่เข้าเวร</option>
                <option value="oldest" ${sortMode==='oldest'?'selected':''}>เก่าสุด</option>
            </select>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden"><ul class="divide-y divide-gray-200 dark:divide-gray-700">`;
        
        if(sorted.length === 0) html += `<li class="p-6 text-center text-gray-500">ยังไม่มีประวัติการจัดเวร</li>`;
        else {
            sorted.forEach(sch => {
                let totalPeople = 0; Object.values(sch.assignments).forEach(arr => totalPeople += arr.length);
                html += `
                <li class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer flex justify-between items-center" onclick="UI.navigate('historyView', {recordId: '${sch.id}'})">
                    <div class="flex items-center gap-4"><div class="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-lg text-primary text-center w-16"><div class="text-xs uppercase font-bold">${new Date(sch.date).toLocaleDateString('th-TH', {month:'short'})}</div><div class="text-xl font-bold">${new Date(sch.date).getDate()}</div></div><div><h4 class="font-bold text-lg">สังกัด: ${sch.affiliation.shortName}</h4><p class="text-sm text-gray-500">กำลังพล ${totalPeople} นาย</p></div></div><i class="fas fa-chevron-right text-gray-400"></i>
                </li>`;
            });
        }
        html += `</ul></div>`;
        UI.container.innerHTML = html;
        document.getElementById('sel-hist-sort').onchange = (e) => { sortMode = e.target.value; renderHistory(); };
    };
    renderHistory();
};

window.Views.historyView = (params) => {
    const record = DB.data.schedules.find(s => s.id === params.recordId);
    if(!record) return UI.navigate('history');
    
    UI.title.innerText = `เวรวันที่ ${Utils.formatDate(record.date)}`;
    
    let html = `<div id="export-content" class="bg-gray-50 dark:bg-gray-900 p-2"><h2 class="text-2xl font-bold text-center mb-6 hidden print:block">ตารางจัดเวร สังกัด ${record.affiliation.shortName} <br>วันที่ ${Utils.formatDate(record.date)}</h2><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">`;
    
    record.affiliation.points.forEach(pt => {
        const persons = record.assignments[pt.id] || [];
        const bColor = pt.color || '#4f46e5';
        html += `<div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border-t-4" style="border-top-color: ${bColor};"><div class="border-b pb-2 mb-3 dark:border-gray-700 flex justify-between items-center"><h3 class="font-bold text-lg">${pt.name}</h3><span class="text-sm text-gray-500">${persons.length} คน</span></div><ul class="space-y-2">
            ${persons.length === 0 ? '<li class="text-gray-400 text-sm italic">ไม่มีผู้เข้าเวร</li>' : ''}
            ${persons.map((p, idx) => `<li class="flex justify-between text-sm p-1 border-b border-gray-100 dark:border-gray-700 last:border-0"><span><span class="font-bold mr-2">${idx+1}.</span>${p.rank} ${p.firstName} ${p.lastName}</span><span class="text-gray-500">PX ${p.px}</span></li>`).join('')}
        </ul></div>`;
    });
    
    html += `</div></div><div class="mt-8 flex gap-4"><button onclick="UI.navigate('home')" class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 font-bold py-4 rounded-xl shadow transition"><i class="fas fa-home mr-2"></i> กลับหน้าหลัก</button><button onclick="editSchedule('${record.id}')" class="flex-1 bg-primary hover:bg-indigo-600 text-white font-bold py-4 rounded-xl shadow transition"><i class="fas fa-edit mr-2"></i> แก้ไขตารางเวร</button></div>`;
    UI.container.innerHTML = html;

    window.editSchedule = (recId) => {
        const rec = DB.data.schedules.find(s => s.id === recId);
        currentDraftData = { id: rec.id, date: rec.date, assignments: JSON.parse(JSON.stringify(rec.assignments)), pool: [] };
        UI.navigate('scheduler', { editMode: true, affiliation: rec.affiliation });
    };
};
