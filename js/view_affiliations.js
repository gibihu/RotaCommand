window.Views.affiliations = () => {
    UI.title.innerText = 'จัดการสังกัด / จุดเวร';
    const renderList = () => {
        let html = `<div class="mb-4 text-right"><button onclick="showAffForm()" class="bg-primary text-white px-4 py-2 rounded shadow"><i class="fas fa-plus mr-2"></i>เพิ่มสังกัด</button></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;
        DB.data.affiliations.forEach(a => {
            html += `<div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border-l-4 ${a.isDefault ? 'border-primary' : 'border-gray-300'}"><div class="flex justify-between items-start mb-3"><div><h3 class="font-bold text-lg">${a.shortName} ${a.isDefault ? '<span class="text-xs bg-primary text-white px-2 py-1 rounded ml-2">ค่าเริ่มต้น</span>' : ''}</h3><p class="text-sm text-gray-500">${a.fullName}</p></div><button onclick="showAffForm('${a.id}')" class="text-blue-500 hover:text-blue-700"><i class="fas fa-edit"></i></button></div><div class="text-sm text-gray-600 dark:text-gray-400"><strong>จุดเข้าเวร (${a.points.length}):</strong><br>${a.points.slice(0, 3).map(pt => `<span style="color:${pt.color||'#4f46e5'}">●</span> ${pt.name}`).join('<br>')}</div></div>`;
        });
        html += `</div>`;
        UI.container.innerHTML = html;
    };

    window.showAffForm = (editId = null) => {
        const a = editId ? JSON.parse(JSON.stringify(DB.data.affiliations.find(x => x.id === editId))) : { shortName: '', fullName: '', isDefault: false, points: [{ id: Utils.generateId(), name: '', capacity: 1, color: '#4f46e5' }] };
        const mId = 'form-aff';
        UI.showModal(`
            <h3 class="text-xl font-bold mb-4">${editId ? 'แก้ไขสังกัด' : 'เพิ่มสังกัด'}</h3>
            <div class="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                <div><label class="text-sm font-bold">ชื่อย่อ</label><input type="text" id="af_short" value="${a.shortName}" class="w-full p-2 border rounded dark:bg-gray-700"></div>
                <div><label class="text-sm font-bold">ชื่อเต็ม</label><input type="text" id="af_full" value="${a.fullName}" class="w-full p-2 border rounded dark:bg-gray-700"></div>
                <div class="flex items-center gap-2"><input type="checkbox" id="af_default" ${a.isDefault ? 'checked' : ''} class="w-5 h-5"><label for="af_default" class="font-bold">ตั้งเป็นค่าเริ่มต้น</label></div>
                <hr class="my-4"><h4 class="font-bold">จุดเข้าเวร</h4>
                <div id="pt-list" class="space-y-2 pb-4">
                    ${a.points.map((pt) => `<div class="flex gap-2 items-center bg-gray-50 dark:bg-gray-700 p-2 rounded pt-item" data-id="${pt.id}"><i class="fas fa-grip-vertical text-gray-400 cursor-move p-2 touch-none"></i><input type="color" value="${pt.color||'#4f46e5'}" class="w-8 h-8 rounded border pt-color"><input type="text" value="${pt.name}" placeholder="ชื่อจุด" class="flex-1 p-1 border rounded pt-name"><input type="number" value="${pt.capacity === 999 ? '' : pt.capacity}" placeholder="ไม่จำกัด" class="w-20 p-1 border rounded pt-cap"><button onclick="removePt(this)" class="text-danger p-1"><i class="fas fa-times"></i></button></div>`).join('')}
                </div>
                <button id="btn-add-pt" class="text-primary text-sm mt-2"><i class="fas fa-plus mr-1"></i> เพิ่มจุดเข้าเวร</button>
            </div>
            <div class="mt-6 flex justify-end gap-2"><button onclick="UI.closeModal('${mId}')" class="px-4 py-2 bg-gray-200 rounded">ยกเลิก</button><button id="btn-save-aff" class="px-4 py-2 bg-primary text-white rounded">บันทึก</button></div>
        `, mId);

        new Sortable(document.getElementById('pt-list'), { animation: 150, handle: '.cursor-move' });
        document.getElementById('btn-add-pt').onclick = () => {
            const div = document.createElement('div'); div.className = "flex gap-2 items-center bg-gray-50 dark:bg-gray-700 p-2 rounded pt-item"; div.dataset.id = Utils.generateId();
            div.innerHTML = `<i class="fas fa-grip-vertical text-gray-400 cursor-move p-2 touch-none"></i><input type="color" value="#4f46e5" class="w-8 h-8 rounded border pt-color"><input type="text" placeholder="ชื่อจุด" class="flex-1 p-1 border rounded pt-name"><input type="number" placeholder="คน" class="w-20 p-1 border rounded pt-cap"><button onclick="removePt(this)" class="text-danger p-1"><i class="fas fa-times"></i></button>`;
            document.getElementById('pt-list').appendChild(div);
        };
        window.removePt = (btn) => btn.closest('.pt-item').remove();

        document.getElementById('btn-save-aff').onclick = () => {
            const pts = Array.from(document.querySelectorAll('.pt-item')).map(el => ({ id: el.dataset.id, name: el.querySelector('.pt-name').value.trim(), capacity: el.querySelector('.pt-cap').value ? parseInt(el.querySelector('.pt-cap').value) : 999, color: el.querySelector('.pt-color').value }));
            const sName = document.getElementById('af_short').value.trim();
            if(!sName || pts.length === 0) return UI.alert('ข้อผิดพลาด', 'กรุณากรอกชื่อย่อและจุดเข้าเวร');
            if(document.getElementById('af_default').checked) DB.data.affiliations.forEach(x => x.isDefault = false);
            
            if(editId) { const target = DB.data.affiliations.find(x => x.id === editId); target.shortName = sName; target.fullName = document.getElementById('af_full').value.trim(); target.isDefault = document.getElementById('af_default').checked; target.points = pts; }
            else { DB.data.affiliations.push({ id: Utils.generateId(), shortName: sName, fullName: document.getElementById('af_full').value.trim(), isDefault: document.getElementById('af_default').checked, points: pts }); }
            DB.save(); UI.closeModal(mId); renderList();
        };
    };
    renderList();
};
