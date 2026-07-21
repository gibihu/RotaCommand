window.Views.personnel = () => {
    UI.title.innerText = 'รายชื่อกำลังพล';
    let showTrash = false;
    let searchQuery = '';
    let filterBatch = '';
    const getBatches = () => [...new Set(DB.data.personnel.filter(p => !p.isDeleted).map(p => p.batch))].sort();

    UI.container.innerHTML = `
        <div class="mb-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow space-y-4">
            <div class="flex justify-between items-center">
                <div class="space-x-2">
                    <button id="btn-add-p" class="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-600 transition"><i class="fas fa-plus mr-2"></i>เพิ่ม</button>
                    <button id="btn-import-p" class="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"><i class="fas fa-file-import mr-2"></i>นำเข้า</button>
                </div>
                <button id="btn-toggle-trash" class="text-gray-500 hover:text-danger"><i class="fas fa-trash mr-1"></i>ถังขยะ</button>
            </div>
            <div class="flex flex-wrap gap-4">
                <div class="flex-1 min-w-[200px]"><input type="text" id="s_search_p" placeholder="ค้นหา ชื่อ, นามสกุล, PX..." class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"></div>
                <div class="w-48"><select id="s_batch_p" class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"></select></div>
            </div>
        </div>
        <div id="p-table-container" class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden"></div>
    `;

    const sBatch = document.getElementById('s_batch_p');
    const updateBatchOptions = () => {
        let opts = '<option value="">ทั้งหมด (รุ่น)</option>';
        getBatches().forEach(b => opts += `<option value="${b}" ${filterBatch === b ? 'selected' : ''}>${b}</option>`);
        sBatch.innerHTML = opts;
    };

    const renderTableOnly = () => {
        let list = DB.data.personnel.filter(p => !!p.isDeleted === showTrash);
        if (filterBatch && !showTrash) list = list.filter(p => p.batch === filterBatch);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            list = list.filter(p => p.firstName.toLowerCase().includes(q) || p.lastName.toLowerCase().includes(q) || String(p.px).includes(q));
        }

        let html = `<div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead class="bg-gray-100 dark:bg-gray-700"><tr><th class="p-3 border-b dark:border-gray-600">ยศ ชื่อ นามสกุล</th><th class="p-3 border-b dark:border-gray-600">รุ่น</th><th class="p-3 border-b dark:border-gray-600">PX</th><th class="p-3 border-b dark:border-gray-600">เข้าเวร (ครั้ง)</th><th class="p-3 border-b dark:border-gray-600 w-24">จัดการ</th></tr></thead><tbody>`;
        if (list.length === 0) html += `<tr><td colspan="5" class="p-6 text-center text-gray-500">ไม่มีข้อมูล</td></tr>`;
        else {
            list.forEach(p => {
                html += `<tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition"><td class="p-3 border-b dark:border-gray-600">${p.rank} ${p.firstName} ${p.lastName}</td><td class="p-3 border-b dark:border-gray-600">${p.batch}</td><td class="p-3 border-b dark:border-gray-600">${p.px}</td><td class="p-3 border-b dark:border-gray-600">${p.shiftCount}</td><td class="p-3 border-b dark:border-gray-600">
                    ${showTrash ? `<button onclick="restorePersonnel('${p.id}')" class="text-green-500 hover:text-green-700 mr-2"><i class="fas fa-undo"></i></button><button onclick="hardDeletePersonnel('${p.id}')" class="text-danger hover:text-red-700"><i class="fas fa-times"></i></button>`
                                : `<button onclick="editPersonnel('${p.id}')" class="text-blue-500 hover:text-blue-700 mr-3"><i class="fas fa-edit"></i></button><button onclick="softDeletePersonnel('${p.id}')" class="text-danger hover:text-red-700"><i class="fas fa-trash"></i></button>`}
                </td></tr>`;
            });
        }
        html += `</tbody></table></div>`;
        document.getElementById('p-table-container').innerHTML = html;
        document.getElementById('btn-toggle-trash').innerHTML = `<i class="fas ${showTrash ? 'fa-list' : 'fa-trash'} mr-1"></i>${showTrash ? 'ดูรายชื่อปกติ' : 'ถังขยะ'}`;
    };

    document.getElementById('s_search_p').addEventListener('input', (e) => { searchQuery = e.target.value; renderTableOnly(); });
    document.getElementById('s_batch_p').addEventListener('change', (e) => { filterBatch = e.target.value; renderTableOnly(); });
    document.getElementById('btn-toggle-trash').onclick = () => { showTrash = !showTrash; renderTableOnly(); };

    // --- ฟังก์ชันเพิ่ม/แก้ไขรายชื่อแบบฟอร์มปกติ ---
    window.showPersonnelForm = (editId = null) => {
        const p = editId ? DB.data.personnel.find(x => x.id === editId) : { rank: '', firstName: '', lastName: '', batch: '', px: '' };
        const mId = 'form-personnel';
        UI.showModal(`
            <h3 class="text-xl font-bold mb-4">${editId ? 'แก้ไขกำลังพล' : 'เพิ่มกำลังพล'}</h3>
            <div class="space-y-3">
                <div><label class="text-sm font-bold">ยศ</label><input type="text" id="p_rank" value="${p.rank}" class="w-full p-2 border rounded dark:bg-gray-700"></div>
                <div><label class="text-sm font-bold">ชื่อ</label><input type="text" id="p_fname" value="${p.firstName}" class="w-full p-2 border rounded dark:bg-gray-700"></div>
                <div><label class="text-sm font-bold">นามสกุล</label><input type="text" id="p_lname" value="${p.lastName}" class="w-full p-2 border rounded dark:bg-gray-700"></div>
                <div><label class="text-sm font-bold">รุ่น</label><input type="text" id="p_batch" value="${p.batch}" class="w-full p-2 border rounded dark:bg-gray-700"></div>
                <div><label class="text-sm font-bold">PX</label><input type="number" id="p_px" value="${p.px}" class="w-full p-2 border rounded dark:bg-gray-700"></div>
            </div>
            <div class="mt-6 flex justify-end gap-2"><button onclick="UI.closeModal('${mId}')" class="px-4 py-2 bg-gray-200 rounded">ยกเลิก</button><button id="btn-save-p" class="px-4 py-2 bg-primary text-white rounded">บันทึก</button></div>
        `, mId);

        document.getElementById('btn-save-p').onclick = () => {
            const rank = document.getElementById('p_rank').value.trim();
            const fname = document.getElementById('p_fname').value.trim();
            const lname = document.getElementById('p_lname').value.trim();
            const batch = document.getElementById('p_batch').value.trim();
            const px = parseInt(document.getElementById('p_px').value);

            if(!fname || isNaN(px)) return UI.alert('ข้อผิดพลาด', 'กรุณากรอกชื่อและ PX ให้ถูกต้อง');

            if(editId) {
                const target = DB.data.personnel.find(x => x.id === editId);
                target.rank = rank; target.firstName = fname; target.lastName = lname; target.batch = batch; target.px = px;
            } else {
                DB.data.personnel.push({ id: Utils.generateId(), rank, firstName: fname, lastName: lname, batch, px, shiftCount: 0, isDeleted: false });
            }
            DB.save(); UI.closeModal(mId); updateBatchOptions(); renderTableOnly();
        };
    };
    document.getElementById('btn-add-p').onclick = () => showPersonnelForm();

    window.editPersonnel = (id) => showPersonnelForm(id);
    window.softDeletePersonnel = (id) => {
        UI.confirm('ย้ายไปถังขยะ', 'ต้องการย้ายกำลังพลนี้ไปถังขยะใช่หรือไม่?', () => {
            DB.data.personnel.find(x => x.id === id).isDeleted = true;
            DB.save(); updateBatchOptions(); renderTableOnly();
        });
    };
    window.restorePersonnel = (id) => {
        DB.data.personnel.find(x => x.id === id).isDeleted = false;
        DB.save(); updateBatchOptions(); renderTableOnly();
    };
    window.hardDeletePersonnel = (id) => {
        UI.confirm('ลบถาวร', 'ต้องการลบกำลังพลนี้อย่างถาวรใช่หรือไม่?', () => {
            DB.data.personnel = DB.data.personnel.filter(x => x.id !== id);
            DB.save(); updateBatchOptions(); renderTableOnly();
        }, 'ลบถาวร', 'ยกเลิก', true);
    };

    // --- ส่วนนำเข้าไฟล์แบบ Dynamic Column Mapping ---
    const showImportForm = () => {
        const mId = 'form-import';
        UI.showModal(`
            <h3 class="text-xl font-bold mb-2">นำเข้าข้อมูลด้วยไฟล์</h3><p class="text-sm text-gray-500 mb-4">ไฟล์ต้องมีหัวคอลัมน์ (เช่น ยศ, ชื่อ, นามสกุล, รุ่น, PX) ไม่จำกัดตำแหน่งคอลัมน์</p>
            <input type="file" id="file-import" accept=".csv, .xlsx" class="w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-700 mb-2">
            <div class="mt-6 flex justify-end gap-2"><button onclick="UI.closeModal('${mId}')" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">ยกเลิก</button><button id="btn-process-import" class="px-4 py-2 bg-green-600 text-white rounded">นำเข้า</button></div>
        `, mId);

        document.getElementById('btn-process-import').onclick = () => {
            const fileInput = document.getElementById('file-import');
            if (!fileInput.files.length) return UI.alert('ข้อผิดพลาด', 'เลือกไฟล์ก่อนนำเข้า');
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, {type: 'array'});
                    const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: 1}); 
                    if(json.length < 2) return UI.alert('ข้อผิดพลาด', 'ไม่พบข้อมูลในไฟล์');

                    const headers = json[0].map(h => String(h||'').toLowerCase().trim());
                    const iRank = headers.findIndex(h => h.includes('ยศ'));
                    const iFname = headers.findIndex(h => h.includes('ชื่อ') && !h.includes('สกุล'));
                    const iLname = headers.findIndex(h => h.includes('สกุล'));
                    const iBatch = headers.findIndex(h => h.includes('รุ่น'));
                    const iPx = headers.findIndex(h => h.includes('px'));

                    if(iFname === -1 || iPx === -1) return UI.alert('ข้อผิดพลาด', 'หาคอลัมน์ "ชื่อ" หรือ "PX" ไม่พบ');

                    let count = 0;
                    json.slice(1).forEach(row => {
                        const fname = String(row[iFname]||'').trim();
                        const pxStr = String(row[iPx]||'').trim();
                        if(fname && pxStr) {
                            const px = parseInt(pxStr.replace(/\s/g, ''));
                            if(!isNaN(px)) {
                                const exists = DB.data.personnel.find(x => !x.isDeleted && x.firstName === fname && x.px === px);
                                if(!exists) {
                                    DB.data.personnel.push({
                                        id: Utils.generateId(),
                                        rank: iRank > -1 ? String(row[iRank]||'').trim() : '',
                                        firstName: fname,
                                        lastName: iLname > -1 ? String(row[iLname]||'').trim() : '',
                                        batch: iBatch > -1 ? String(row[iBatch]||'').trim() : '',
                                        px: px, shiftCount: 0, isDeleted: false
                                    });
                                    count++;
                                }
                            }
                        }
                    });
                    DB.save(); UI.closeModal(mId); updateBatchOptions(); renderTableOnly();
                    UI.alert('สำเร็จ', `นำเข้าข้อมูลเรียบร้อย ${count} รายการ`);
                } catch(err) { UI.alert('ข้อผิดพลาด', 'ไม่สามารถอ่านไฟล์ได้'); }
            };
            reader.readAsArrayBuffer(fileInput.files[0]);
        };
    };
    document.getElementById('btn-import-p').onclick = showImportForm;

    updateBatchOptions();
    renderTableOnly();
};
