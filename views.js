
// ==========================================
// VIEWS (UI Renderers)
// ==========================================
const Views = {
   // --- HOME ---
   home: () => {
       UI.title.innerText = 'ระบบจัดเวร บก.';
       UI.container.innerHTML = `
           <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div onclick="UI.navigate('history')" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow cursor-pointer hover:shadow-md transition border-l-4 border-primary flex items-center gap-4">
                   <div class="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full text-primary"><i class="fas fa-history fa-fw text-xl"></i></div>
                   <div><h3 class="font-bold text-lg">ดูประวัติ / เวรล่าสุด</h3><p class="text-sm text-gray-500">ตรวจสอบตารางเวรที่จัดแล้ว</p></div>
               </div>
               <div onclick="UI.navigate('personnel')" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow cursor-pointer hover:shadow-md transition border-l-4 border-green-500 flex items-center gap-4">
                   <div class="bg-green-100 dark:bg-green-900 p-3 rounded-full text-green-500"><i class="fas fa-users fa-fw text-xl"></i></div>
                   <div><h3 class="font-bold text-lg">รายชื่อกำลังพล</h3><p class="text-sm text-gray-500">เพิ่ม ลบ แก้ไข รายชื่อ</p></div>
               </div>
               <div onclick="UI.navigate('selectPersonnel')" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow cursor-pointer hover:shadow-md transition border-l-4 border-yellow-500 flex items-center gap-4">
                   <div class="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full text-yellow-500"><i class="fas fa-calendar-alt fa-fw text-xl"></i></div>
                   <div><h3 class="font-bold text-lg">จัดเวร</h3><p class="text-sm text-gray-500">เลือกกำลังพลและจัดจุดเข้าเวร</p></div>
               </div>
               <div onclick="UI.navigate('affiliations')" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow cursor-pointer hover:shadow-md transition border-l-4 border-purple-500 flex items-center gap-4">
                   <div class="bg-purple-100 dark:bg-purple-900 p-3 rounded-full text-purple-500"><i class="fas fa-sitemap fa-fw text-xl"></i></div>
                   <div><h3 class="font-bold text-lg">สังกัด / จุดเวร</h3><p class="text-sm text-gray-500">จัดการข้อมูลสังกัดและจุดต่างๆ</p></div>
               </div>
               <div onclick="UI.navigate('settings')" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow cursor-pointer hover:shadow-md transition border-l-4 border-gray-500 flex items-center gap-4 sm:col-span-2">
                   <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded-full text-gray-500"><i class="fas fa-cog fa-fw text-xl"></i></div>
                   <div><h3 class="font-bold text-lg">ตั้งค่า</h3><p class="text-sm text-gray-500">ปรับแต่งระบบและการแสดงผล</p></div>
               </div>
           </div>
       `;
   },

   // --- PERSONNEL ---
   personnel: () => {
       UI.title.innerText = 'รายชื่อกำลังพล';
       let showTrash = false;
       
       const renderList = () => {
           const list = DB.data.personnel.filter(p => !!p.isDeleted === showTrash);
           let html = `<div class="mb-4 flex justify-between items-center">
               <div class="space-x-2">
                   <button id="btn-add-p" class="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-600 transition"><i class="fas fa-plus mr-2"></i>เพิ่ม</button>
                   <button id="btn-import-p" class="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"><i class="fas fa-file-import mr-2"></i>นำเข้า</button>
               </div>
               <button id="btn-toggle-trash" class="text-gray-500 hover:text-danger"><i class="fas ${showTrash ? 'fa-list' : 'fa-trash'} mr-1"></i>${showTrash ? 'ดูรายชื่อปกติ' : 'ถังขยะ'}</button>
           </div>`;

           html += `<div class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
               <div class="overflow-x-auto">
                   <table class="w-full text-left border-collapse">
                       <thead class="bg-gray-100 dark:bg-gray-700">
                           <tr>
                               <th class="p-3 border-b dark:border-gray-600">ยศ ชื่อ นามสกุล</th>
                               <th class="p-3 border-b dark:border-gray-600">รุ่น</th>
                               <th class="p-3 border-b dark:border-gray-600">PX</th>
                               <th class="p-3 border-b dark:border-gray-600">เข้าเวร (ครั้ง)</th>
                               <th class="p-3 border-b dark:border-gray-600 w-24">จัดการ</th>
                           </tr>
                       </thead>
                       <tbody>`;
           
           if (list.length === 0) {
               html += `<tr><td colspan="5" class="p-6 text-center text-gray-500">ไม่มีข้อมูล</td></tr>`;
           } else {
               list.forEach(p => {
                   html += `
                   <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                       <td class="p-3 border-b dark:border-gray-600">${p.rank} ${p.firstName} ${p.lastName}</td>
                       <td class="p-3 border-b dark:border-gray-600">${p.batch}</td>
                       <td class="p-3 border-b dark:border-gray-600">${p.px}</td>
                       <td class="p-3 border-b dark:border-gray-600">${p.shiftCount}</td>
                       <td class="p-3 border-b dark:border-gray-600">
                           ${showTrash 
                               ? `<button onclick="restorePersonnel('${p.id}')" class="text-green-500 hover:text-green-700 mr-2"><i class="fas fa-undo"></i></button>
                                  <button onclick="hardDeletePersonnel('${p.id}')" class="text-danger hover:text-red-700"><i class="fas fa-times"></i></button>`
                               : `<button onclick="editPersonnel('${p.id}')" class="text-blue-500 hover:text-blue-700 mr-3"><i class="fas fa-edit"></i></button>
                                  <button onclick="softDeletePersonnel('${p.id}')" class="text-danger hover:text-red-700"><i class="fas fa-trash"></i></button>`
                           }
                       </td>
                   </tr>`;
               });
           }
           html += `</tbody></table></div></div>`;
           UI.container.innerHTML = html;

           document.getElementById('btn-add-p').onclick = () => showPersonnelForm();
           document.getElementById('btn-import-p').onclick = () => showImportForm();
           document.getElementById('btn-toggle-trash').onclick = () => { showTrash = !showTrash; renderList(); };
       };

       const showPersonnelForm = (editId = null) => {
           const p = editId ? DB.data.personnel.find(x => x.id === editId) : null;
           const mId = 'form-personnel';
           UI.showModal(`
               <h3 class="text-xl font-bold mb-4">${p ? 'แก้ไขรายชื่อ' : 'เพิ่มรายชื่อ'}</h3>
               <div class="space-y-3">
                   <input type="text" id="f_rank" placeholder="ยศ (เช่น ส.อ.)" value="${p ? p.rank : ''}" class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                   <input type="text" id="f_fname" placeholder="ชื่อ" value="${p ? p.firstName : ''}" class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                   <input type="text" id="f_lname" placeholder="นามสกุล" value="${p ? p.lastName : ''}" class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                   <input type="text" id="f_batch" placeholder="รุ่น (เช่น 69/1)" value="${p ? p.batch : ''}" class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                   <input type="number" id="f_px" placeholder="PX (ตัวเลข)" value="${p ? p.px : ''}" class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                   <input type="number" id="f_count" placeholder="จำนวนครั้งที่เคยเข้าเวร" value="${p ? p.shiftCount : '0'}" class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
               </div>
               <div class="mt-6 flex justify-end gap-2">
                   <button onclick="UI.closeModal('${mId}')" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">ยกเลิก</button>
                   <button id="btn-save-p" class="px-4 py-2 bg-primary text-white rounded">บันทึก</button>
               </div>
           `, mId);

           document.getElementById('btn-save-p').onclick = () => {
               const rank = document.getElementById('f_rank').value.trim();
               const fname = document.getElementById('f_fname').value.trim();
               const lname = document.getElementById('f_lname').value.trim();
               const batch = document.getElementById('f_batch').value.trim();
               const px = parseInt(document.getElementById('f_px').value.trim());
               const count = parseInt(document.getElementById('f_count').value.trim() || 0);

               if(!rank || !fname || !lname || !batch || isNaN(px)) {
                   return UI.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง (PX ต้องเป็นตัวเลข)');
               }

               const duplicate = DB.data.personnel.find(x => !x.isDeleted && x.batch === batch && x.px === px && x.id !== editId);
               if(duplicate) return UI.alert('ข้อมูลซ้ำ', `มีบุคคลที่ใช้ รุ่น ${batch} และ PX ${px} อยู่ในระบบแล้ว`);

               if (p) {
                   p.rank = rank; p.firstName = fname; p.lastName = lname; p.batch = batch; p.px = px; p.shiftCount = count;
               } else {
                   DB.data.personnel.push({ id: Utils.generateId(), rank, firstName: fname, lastName: lname, batch, px, shiftCount: count, isDeleted: false });
               }
               DB.save(); UI.closeModal(mId); renderList();
           };
       };

       const showImportForm = () => {
           const mId = 'form-import';
           UI.showModal(`
               <h3 class="text-xl font-bold mb-2">นำเข้าข้อมูลด้วยไฟล์</h3>
               <p class="text-sm text-gray-500 mb-4">รองรับไฟล์ .csv และ .xlsx (รูปแบบคอลัมน์: ยศ | ชื่อ | นามสกุล | รุ่น | PX | จำนวนครั้ง)</p>
               <input type="file" id="file-import" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" class="w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-700 mb-2">
               <div class="mt-6 flex justify-end gap-2">
                   <button onclick="UI.closeModal('${mId}')" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">ยกเลิก</button>
                   <button id="btn-process-import" class="px-4 py-2 bg-green-600 text-white rounded">นำเข้า</button>
               </div>
           `, mId);

           document.getElementById('btn-process-import').onclick = () => {
               const fileInput = document.getElementById('file-import');
               if (!fileInput.files.length) return UI.alert('ข้อผิดพลาด', 'กรุณาเลือกไฟล์ก่อนนำเข้า');
               
               const file = fileInput.files[0];
               const reader = new FileReader();
               
               reader.onload = (e) => {
                   try {
                       const data = new Uint8Array(e.target.result);
                       const workbook = XLSX.read(data, {type: 'array'});
                       const sheetName = workbook.SheetNames[0];
                       const worksheet = workbook.Sheets[sheetName];
                       const json = XLSX.utils.sheet_to_json(worksheet, {header: 1}); 
                       
                       let count = 0;
                       json.forEach(row => {
                           if(row.length >= 5) {
                               const rank = String(row[0]||'').trim();
                               const fname = String(row[1]||'').trim();
                               const lname = String(row[2]||'').trim();
                               const batch = String(row[3]||'').trim();
                               const pxStr = String(row[4]||'').trim();
                               const shiftStr = String(row[5]||'0').trim();

                               if(rank && fname && lname && batch && pxStr && rank !== 'ยศ' && rank !== 'Rank') {
                                   const px = parseInt(pxStr.replace(/\s/g, ''));
                                   const shiftCount = parseInt(shiftStr) || 0;
                                   
                                   if(!isNaN(px)) {
                                       const exists = DB.data.personnel.find(x => !x.isDeleted && x.batch === batch && x.px === px);
                                       if(!exists) {
                                           DB.data.personnel.push({ id: Utils.generateId(), rank, firstName: fname, lastName: lname, batch, px, shiftCount, isDeleted: false });
                                           count++;
                                       }
                                   }
                               }
                           }
                       });
                       DB.save();
                       UI.closeModal(mId);
                       UI.alert('สำเร็จ', `นำเข้าข้อมูลเรียบร้อยจำนวน ${count} รายการ (ข้ามข้อมูลที่ซ้ำหรือไม่ถูกต้อง)`);
                       renderList();
                   } catch(err) {
                       UI.alert('ข้อผิดพลาด', 'ไม่สามารถอ่านไฟล์ได้ กรุณาตรวจสอบรูปแบบไฟล์');
                   }
               };
               reader.readAsArrayBuffer(file);
           };
       }

       window.editPersonnel = showPersonnelForm;
       window.softDeletePersonnel = (id) => {
           UI.confirm('ยืนยันการลบ', 'ข้อมูลจะถูกย้ายไปที่ถังขยะ', () => {
               DB.data.personnel.find(p => p.id === id).isDeleted = true;
               DB.save(); renderList();
           });
       };
       window.restorePersonnel = (id) => {
           DB.data.personnel.find(p => p.id === id).isDeleted = false;
           DB.save(); renderList();
       };
       window.hardDeletePersonnel = (id) => {
           UI.confirm('ลบถาวร', 'คุณต้องการลบข้อมูลนี้ถาวรใช่หรือไม่? (ไม่สามารถกู้คืนได้)', () => {
               DB.data.personnel = DB.data.personnel.filter(p => p.id !== id);
               DB.save(); renderList();
           }, 'ลบถาวร', 'ยกเลิก', true);
       };

       renderList();
   },

   // --- SELECT PERSONNEL ---
   selectPersonnel: () => {
       UI.title.innerText = 'เลือกกำลังพลจัดเวร';
       
       let selectedIds = new Set(DB.data.draftSelection || []);
       let searchQuery = '';
       let filterBatch = '';
       
       const getBatches = () => [...new Set(DB.data.personnel.filter(p => !p.isDeleted).map(p => p.batch))].sort();

       const renderSelectionList = () => {
           let list = DB.data.personnel.filter(p => !p.isDeleted);
           if (filterBatch) list = list.filter(p => p.batch === filterBatch);
           if (searchQuery) {
               const q = searchQuery.toLowerCase();
               list = list.filter(p => p.firstName.toLowerCase().includes(q) || p.lastName.toLowerCase().includes(q) || p.px.toString().includes(q));
           }

           const batches = getBatches();
           let batchOptions = '<option value="">ทั้งหมด (รุ่น)</option>';
           batches.forEach(b => batchOptions += `<option value="${b}" ${filterBatch === b ? 'selected' : ''}>${b}</option>`);

           let html = `
           <div class="mb-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow space-y-4">
               <div class="flex flex-wrap gap-4">
                   <div class="flex-1 min-w-[200px]">
                       <input type="text" id="s_search" placeholder="ค้นหา ชื่อ, นามสกุล, PX..." value="${searchQuery}" class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                   </div>
                   <div class="w-48">
                       <select id="s_batch" class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                           ${batchOptions}
                       </select>
                   </div>
               </div>
               <div class="flex justify-between items-center">
                   <span class="font-bold text-primary">เลือกแล้ว: ${selectedIds.size} คน</span>
                   <div class="space-x-2">
                       <button id="btn-clear-sel" class="text-gray-500 hover:text-danger px-3 py-1"><i class="fas fa-broom mr-1"></i>ล้าง</button>
                       <button id="btn-confirm-sel" class="bg-primary text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-600 transition">จัดเวร <i class="fas fa-arrow-right ml-1"></i></button>
                   </div>
               </div>
           </div>

           <div class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
               <div class="overflow-x-auto">
                   <table class="w-full text-left border-collapse">
                       <thead class="bg-gray-100 dark:bg-gray-700">
                           <tr>
                               <th class="p-3 border-b dark:border-gray-600 w-12 text-center">เลือก</th>
                               <th class="p-3 border-b dark:border-gray-600">ยศ ชื่อ นามสกุล</th>
                               <th class="p-3 border-b dark:border-gray-600">รุ่น</th>
                               <th class="p-3 border-b dark:border-gray-600">PX</th>
                               <th class="p-3 border-b dark:border-gray-600">เข้าเวร</th>
                           </tr>
                       </thead>
                       <tbody>`;
           
           if (list.length === 0) {
               html += `<tr><td colspan="5" class="p-6 text-center text-gray-500">ไม่พบรายชื่อ</td></tr>`;
           } else {
               list.forEach(p => {
                   const isChecked = selectedIds.has(p.id) ? 'checked' : '';
                   html += `
                   <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer" onclick="toggleSel('${p.id}')">
                       <td class="p-3 border-b dark:border-gray-600 text-center">
                           <input type="checkbox" id="chk_${p.id}" ${isChecked} class="w-5 h-5 text-primary rounded focus:ring-primary cursor-pointer" onclick="event.stopPropagation(); toggleSel('${p.id}')">
                       </td>
                       <td class="p-3 border-b dark:border-gray-600">${p.rank} ${p.firstName} ${p.lastName}</td>
                       <td class="p-3 border-b dark:border-gray-600">${p.batch}</td>
                       <td class="p-3 border-b dark:border-gray-600">${p.px}</td>
                       <td class="p-3 border-b dark:border-gray-600">${p.shiftCount} ครั้ง</td>
                   </tr>`;
               });
           }
           html += `</tbody></table></div></div>`;
           
           UI.container.innerHTML = html;

           document.getElementById('s_search').addEventListener('input', (e) => { searchQuery = e.target.value; renderSelectionList(); });
           document.getElementById('s_batch').addEventListener('change', (e) => { filterBatch = e.target.value; renderSelectionList(); });
           
           document.getElementById('btn-clear-sel').onclick = () => {
               if(selectedIds.size > 0) {
                   UI.confirm('ล้างการเลือก', 'ต้องการยกเลิกการเลือกบุคคลทั้งหมดหรือไม่?', () => {
                       selectedIds.clear();
                       DB.data.draftSelection = []; DB.save();
                       renderSelectionList();
                   });
               }
           };
           document.getElementById('btn-confirm-sel').onclick = processSelection;
       };

       window.toggleSel = (id) => {
           if(selectedIds.has(id)) selectedIds.delete(id);
           else selectedIds.add(id);
           DB.data.draftSelection = Array.from(selectedIds);
           DB.save();
           const chk = document.getElementById('chk_' + id);
           if(chk) chk.checked = selectedIds.has(id);
           const txt = document.querySelector('.text-primary.font-bold');
           if(txt) txt.innerText = `เลือกแล้ว: ${selectedIds.size} คน`;
       };

       const processSelection = () => {
           if (selectedIds.size === 0) return UI.alert('แจ้งเตือน', 'กรุณาเลือกกำลังพลอย่างน้อย 1 นาย');
           
           const defaultAff = DB.getDefaultAffiliation();
           let reqPeople = 0;
           defaultAff.points.forEach(pt => { if(pt.capacity !== 999) reqPeople += parseInt(pt.capacity); });
           
           const proceed = () => {
               const selectedPx = Array.from(selectedIds).map(id => {
                   const p = DB.data.personnel.find(x => x.id === id);
                   return p ? p.px : '';
               }).join(', ');
               
               UI.confirm('ยืนยันรายชื่อจัดเวร', `กำลังพลที่เลือก: ${selectedIds.size} นาย<br><br><div class="text-sm text-gray-500 max-h-32 overflow-y-auto">PX: ${selectedPx}</div>`, () => {
                   UI.navigate('scheduler', { startFresh: true });
               });
           };

           if (selectedIds.size < reqPeople) {
               UI.confirm('จำนวนคนไม่ครบ', `สังกัด ${defaultAff.shortName} ต้องการคนอย่างน้อย ${reqPeople} นาย (ไม่รวม ฉก.) แต่เลือกมาเพียง ${selectedIds.size} นาย ต้องการดำเนินการต่อหรือไม่?`, proceed, 'ดำเนินการต่อ');
           } else {
               proceed();
           }
       };

       renderSelectionList();
   },

   // --- SCHEDULER (DRAG & DROP) ---
   scheduler: (params = {}) => {
       UI.title.innerText = 'ตารางจัดเวร';
       let aff = params.affiliation || DB.getDefaultAffiliation();
       
       if (params.startFresh || !currentDraftData) {
           const selectedList = DB.data.draftSelection.map(id => DB.data.personnel.find(p => p.id === id)).filter(x=>x);
           
           currentDraftData = {
               id: null,
               date: new Date().toISOString().split('T')[0],
               assignments: {},
               pool: []
           };
           
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
           
           while(currentPersonIdx < selectedList.length) {
               currentDraftData.pool.push(selectedList[currentPersonIdx]);
               currentPersonIdx++;
           }
       } else if (params.editMode) {
           aff = params.affiliation;
       }

       const checkValidity = () => {
           let isValid = true;
           aff.points.forEach(pt => {
               const count = currentDraftData.assignments[pt.id]?.length || 0;
               if(pt.capacity !== 999 && count > pt.capacity) isValid = false;
           });
           return isValid;
       };

       const renderGrid = () => {
           const isValid = checkValidity();
           let html = `
           <div class="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
               <div class="flex items-center gap-2">
                   <label class="font-bold">วันที่เข้าเวร:</label>
                   <input type="date" id="sch_date" value="${currentDraftData.date}" class="p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
               </div>
               <div class="flex gap-2">
                   <button id="btn-random" class="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700"><i class="fas fa-dice mr-2"></i>สุ่มจัดคน</button>
                   <button id="btn-save-sch" class="bg-primary text-white px-6 py-2 rounded shadow hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed" ${isValid?'':'disabled'}><i class="fas fa-save mr-2"></i>บันทึกเวร</button>
               </div>
           </div>
           
           <div class="flex flex-col lg:flex-row gap-4">
               <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4" id="schedule-grid">
           `;

           aff.points.forEach(pt => {
               const persons = currentDraftData.assignments[pt.id] || [];
               const isUnlimited = pt.capacity === 999;
               const isOver = !isUnlimited && persons.length > pt.capacity;
               const countText = isUnlimited ? `${persons.length} คน` : `${persons.length}/${pt.capacity}`;
               const countClass = isOver ? 'text-danger font-bold' : 'text-gray-500';

               html += `
               <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border-t-4 ${pt.capacity === 999 ? 'border-yellow-500' : 'border-primary'}">
                   <div class="flex justify-between items-center mb-3 border-b pb-2 dark:border-gray-700">
                       <h3 class="font-bold text-lg">${pt.name}</h3>
                       <span class="${countClass} text-sm">${countText}</span>
                   </div>
                   <div class="dropzone space-y-2" data-point-id="${pt.id}">
                       ${persons.map((p, idx) => `
                           <div class="draggable bg-gray-50 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 flex justify-between items-center shadow-sm cursor-move" data-person-id="${p.id}">
                               <div><span class="text-xs font-bold text-gray-400 mr-2 seq-num">${idx+1}.</span>${p.rank} ${p.firstName} ${p.lastName}</div>
                               <div class="text-xs text-gray-500 text-right">รุ่น ${p.batch}<br>PX ${p.px}</div>
                           </div>
                       `).join('')}
                   </div>
               </div>`;
           });

           html += `</div>
               <div class="lg:w-80 bg-white dark:bg-gray-800 rounded-xl shadow p-4 border-t-4 border-gray-400 flex flex-col">
                   <h3 class="font-bold text-lg mb-3 border-b pb-2 dark:border-gray-700 flex justify-between"><span>รายชื่อรอจัด</span><span class="text-primary">${currentDraftData.pool.length}</span></h3>
                   <div class="dropzone space-y-2 flex-1 min-h-[200px]" data-point-id="pool">
                       ${currentDraftData.pool.map(p => `
                           <div class="draggable bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded border border-indigo-200 dark:border-indigo-800 flex justify-between items-center shadow-sm cursor-move" data-person-id="${p.id}">
                               <div>${p.rank} ${p.firstName} ${p.lastName}</div>
                               <div class="text-xs text-indigo-500 text-right">รุ่น ${p.batch}</div>
                           </div>
                       `).join('')}
                   </div>
               </div>
           </div>`;

           UI.container.innerHTML = html;
           attachDragDropEvents();

           document.getElementById('sch_date').addEventListener('change', e => currentDraftData.date = e.target.value);
           
           document.getElementById('btn-random').onclick = () => {
               let allPeople = [...currentDraftData.pool];
               aff.points.forEach(pt => {
                   allPeople = allPeople.concat(currentDraftData.assignments[pt.id] || []);
                   currentDraftData.assignments[pt.id] = [];
               });
               
               for (let i = allPeople.length - 1; i > 0; i--) {
                   const j = Math.floor(Math.random() * (i + 1));
                   [allPeople[i], allPeople[j]] = [allPeople[j], allPeople[i]];
               }

               currentDraftData.pool = [];
               let pIdx = 0;
               aff.points.forEach(pt => {
                   if(pt.capacity !== 999) {
                       while(currentDraftData.assignments[pt.id].length < pt.capacity && pIdx < allPeople.length) {
                           currentDraftData.assignments[pt.id].push(allPeople[pIdx]);
                           pIdx++;
                       }
                   }
               });
               while(pIdx < allPeople.length) {
                   currentDraftData.pool.push(allPeople[pIdx]);
                   pIdx++;
               }
               renderGrid();
           };

           document.getElementById('btn-save-sch').onclick = () => {
               UI.confirm('บันทึกตารางเวร', `ตารางเวรวันที่ ${Utils.formatDate(currentDraftData.date)} จะถูกบันทึกลงประวัติ`, () => {
                   if(currentDraftData.id) {
                       const oldRecord = DB.data.schedules.find(s => s.id === currentDraftData.id);
                       if(oldRecord) {
                           oldRecord.affiliation.points.forEach(pt => {
                               (oldRecord.assignments[pt.id]||[]).forEach(oldP => {
                                   const dbP = DB.data.personnel.find(p => p.id === oldP.id);
                                   if(dbP && dbP.shiftCount > 0) dbP.shiftCount--;
                               });
                           });
                           DB.data.schedules = DB.data.schedules.filter(s => s.id !== currentDraftData.id);
                       }
                   }

                   const newRecord = {
                       id: currentDraftData.id || Utils.generateId(),
                       date: currentDraftData.date,
                       affiliation: JSON.parse(JSON.stringify(aff)),
                       assignments: currentDraftData.assignments,
                       timestamp: Date.now()
                   };
                   DB.data.schedules.push(newRecord);
                   
                   aff.points.forEach(pt => {
                       (currentDraftData.assignments[pt.id]||[]).forEach(assignedP => {
                           const dbPerson = DB.data.personnel.find(p => p.id === assignedP.id);
                           if(dbPerson) dbPerson.shiftCount = (dbPerson.shiftCount || 0) + 1;
                       });
                   });

                   DB.data.draftSelection = [];
                   DB.save();
                   currentDraftData = null;
                   UI.navigate('historyView', { recordId: newRecord.id });
               });
           };
       };

       const rebuildDraftDataFromDOM = () => {
           const newAssignments = {};
           let newPool = [];

           aff.points.forEach(pt => {
               const dz = document.querySelector(`.dropzone[data-point-id="${pt.id}"]`);
               const persons = [];
               if (dz) {
                   dz.querySelectorAll('.draggable').forEach(el => {
                       const p = DB.data.personnel.find(x => x.id === el.dataset.personId);
                       if(p) persons.push(p);
                   });
               }
               newAssignments[pt.id] = persons;
           });

           const poolDz = document.querySelector(`.dropzone[data-point-id="pool"]`);
           if (poolDz) {
               poolDz.querySelectorAll('.draggable').forEach(el => {
                   const p = DB.data.personnel.find(x => x.id === el.dataset.personId);
                   if(p) newPool.push(p);
               });
           }

           currentDraftData.assignments = newAssignments;
           currentDraftData.pool = newPool;
           renderGrid();
       };

       const attachDragDropEvents = () => {
           document.querySelectorAll('.dropzone').forEach(dz => {
               new Sortable(dz, {
                   group: 'shared', 
                   animation: 150,
                   ghostClass: 'sortable-ghost',
                   onEnd: function () {
                       rebuildDraftDataFromDOM();
                   }
               });
           });
       };

       renderGrid();
   },

   // --- HISTORY LIST & VIEW (ย่อไว้เพื่อความกระชับ) ---
   history: () => {
       UI.title.innerText = 'ประวัติการจัดเวร';
       const sorted = [...DB.data.schedules].sort((a,b) => new Date(b.date) - new Date(a.date));
       
       let html = `<div class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden"><ul class="divide-y divide-gray-200 dark:divide-gray-700">`;
       
       if(sorted.length === 0) {
           html += `<li class="p-6 text-center text-gray-500">ยังไม่มีประวัติการจัดเวร</li>`;
       } else {
           sorted.forEach(sch => {
               let totalPeople = 0;
               Object.values(sch.assignments).forEach(arr => totalPeople += arr.length);
               html += `
               <li class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer flex justify-between items-center" onclick="UI.navigate('historyView', {recordId: '${sch.id}'})">
                   <div class="flex items-center gap-4">
                       <div class="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-lg text-primary text-center w-16">
                           <div class="text-xs uppercase font-bold">${new Date(sch.date).toLocaleDateString('th-TH', {month:'short'})}</div>
                           <div class="text-xl font-bold">${new Date(sch.date).getDate()}</div>
                       </div>
                       <div>
                           <h4 class="font-bold text-lg">สังกัด: ${sch.affiliation.shortName}</h4>
                           <p class="text-sm text-gray-500">กำลังพลรวม ${totalPeople} นาย</p>
                       </div>
                   </div>
                   <i class="fas fa-chevron-right text-gray-400"></i>
               </li>`;
           });
       }
       html += `</ul></div>`;
       UI.container.innerHTML = html;
   },

   historyView: (params) => {
       const record = DB.data.schedules.find(s => s.id === params.recordId);
       if(!record) return UI.navigate('history');
       
       UI.title.innerText = `เวรวันที่ ${Utils.formatDate(record.date)}`;

       UI.actions.innerHTML = `
           <div class="relative inline-block text-left">
               <button id="btn-export-menu" class="text-gray-500 hover:text-primary p-2">
                   <i class="fas fa-ellipsis-v text-xl"></i>
               </button>
               <div id="export-dropdown" class="hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                   <div class="py-1">
                       <button onclick="ExportHelper.toPDF()" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"><i class="fas fa-file-pdf mr-2 text-red-500"></i>ส่งออก PDF</button>
                       <button onclick="ExportHelper.toExcel()" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"><i class="fas fa-file-excel mr-2 text-green-500"></i>ส่งออก Excel</button>
                       <button onclick="ExportHelper.toCSV()" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"><i class="fas fa-file-csv mr-2 text-green-600"></i>ส่งออก CSV</button>
                       <button onclick="ExportHelper.toTXT()" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"><i class="fas fa-file-alt mr-2 text-gray-500"></i>ส่งออก TXT</button>
                       <div class="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                       <button onclick="editSchedule('${record.id}')" class="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"><i class="fas fa-edit mr-2"></i>แก้ไขข้อมูล</button>
                       <button onclick="deleteSchedule('${record.id}')" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"><i class="fas fa-trash mr-2"></i>ลบข้อมูล</button>
                   </div>
               </div>
           </div>
       `;

       const menuBtn = document.getElementById('btn-export-menu');
       const dropdown = document.getElementById('export-dropdown');
       menuBtn.onclick = (e) => { e.stopPropagation(); dropdown.classList.toggle('hidden'); };
       document.addEventListener('click', () => dropdown.classList.add('hidden'));

       let html = `
       <div id="export-content" class="bg-gray-50 dark:bg-gray-900 p-2">
           <h2 class="text-2xl font-bold text-center mb-6 hidden print:block">ตารางจัดเวร สังกัด ${record.affiliation.shortName} <br>วันที่ ${Utils.formatDate(record.date)}</h2>
           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       `;

       record.affiliation.points.forEach(pt => {
           const persons = record.assignments[pt.id] || [];
           html += `
           <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border-t-4 border-primary">
               <div class="border-b pb-2 mb-3 dark:border-gray-700 flex justify-between items-center">
                   <h3 class="font-bold text-lg">${pt.name}</h3>
                   <span class="text-sm text-gray-500">${persons.length} คน</span>
               </div>
               <ul class="space-y-2">
                   ${persons.length === 0 ? '<li class="text-gray-400 text-sm italic">ไม่มีผู้เข้าเวร</li>' : ''}
                   ${persons.map((p, idx) => `
                       <li class="flex justify-between text-sm p-1 border-b border-gray-100 dark:border-gray-700 last:border-0">
                           <span><span class="font-bold mr-2">${idx+1}.</span>${p.rank} ${p.firstName} ${p.lastName}</span>
                           <span class="text-gray-500">PX ${p.px}</span>
                       </li>
                   `).join('')}
               </ul>
           </div>`;
       });

       html += `</div></div>
       <div class="mt-8">
           <button onclick="UI.navigate('home')" class="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-4 rounded-xl shadow transition">
               <i class="fas fa-home mr-2"></i> กลับหน้าหลัก
           </button>
       </div>`;
       
       UI.container.innerHTML = html;

       window.editSchedule = (recId) => {
           const rec = DB.data.schedules.find(s => s.id === recId);
           if(rec) {
               currentDraftData = { id: rec.id, date: rec.date, assignments: JSON.parse(JSON.stringify(rec.assignments)), pool: [] };
               UI.navigate('scheduler', { editMode: true, affiliation: rec.affiliation });
           }
       };
       
       window.deleteSchedule = (recId) => {
           UI.confirm('ยืนยันการลบ', 'คุณต้องการลบประวัติเวรนี้ใช่หรือไม่?', () => {
               const rec = DB.data.schedules.find(s => s.id === recId);
               if(rec) {
                   rec.affiliation.points.forEach(pt => {
                       (rec.assignments[pt.id]||[]).forEach(oldP => {
                           const dbP = DB.data.personnel.find(p => p.id === oldP.id);
                           if(dbP && dbP.shiftCount > 0) dbP.shiftCount--;
                       });
                   });
                   DB.data.schedules = DB.data.schedules.filter(s => s.id !== recId);
                   DB.save();
                   UI.navigate('history');
               }
           }, 'ลบข้อมูล', 'ยกเลิก', true);
       };

       window.ExportHelper = {
           getRawData: () => {
               let lines = [`ตารางจัดเวร: ${record.affiliation.fullName}`, `วันที่: ${Utils.formatDate(record.date)}`, `========================`];
               record.affiliation.points.forEach(pt => {
                   lines.push(`\n[ จุด: ${pt.name} ]`);
                   const pList = record.assignments[pt.id] || [];
                   if(pList.length === 0) lines.push("- ไม่มี");
                   pList.forEach((p, i) => lines.push(`${i+1}. ${p.rank} ${p.firstName} ${p.lastName} (รุ่น ${p.batch}, PX ${p.px})`));
               });
               return lines.join('\n');
           },
           toTXT: () => {
               const blob = new Blob([ExportHelper.getRawData()], { type: "text/plain;charset=utf-8" });
               const link = document.createElement("a");
               link.href = URL.createObjectURL(blob);
               link.download = `ตารางเวร_${record.date}.txt`;
               link.click();
           },
           toPDF: () => {
               const element = document.getElementById('export-content');
               const opt = {
                   margin: 10, filename: `ตารางเวร_${record.date}.pdf`,
                   image: { type: 'jpeg', quality: 0.98 },
                   html2canvas: { scale: 2, useCORS: true },
                   jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
               };
               element.classList.add('print:block');
               html2pdf().set(opt).from(element).save().then(()=> element.classList.remove('print:block'));
           },
           _getExcelData: () => {
               let wsData = [[`ตารางจัดเวร ${record.affiliation.shortName}`, `วันที่ ${Utils.formatDate(record.date)}`], []];
               record.affiliation.points.forEach(pt => {
                   wsData.push([`จุด: ${pt.name}`]);
                   wsData.push(["ลำดับ", "ยศ", "ชื่อ", "นามสกุล", "รุ่น", "PX"]);
                   const pList = record.assignments[pt.id] || [];
                   pList.forEach((p, i) => { wsData.push([i+1, p.rank, p.firstName, p.lastName, p.batch, p.px]); });
                   wsData.push([]); 
               });
               return wsData;
           },
           toExcel: () => {
               const wb = XLSX.utils.book_new();
               const ws = XLSX.utils.aoa_to_sheet(ExportHelper._getExcelData());
               XLSX.utils.book_append_sheet(wb, ws, "ตารางเวร");
               XLSX.writeFile(wb, `ตารางเวร_${record.date}.xlsx`);
           },
           toCSV: () => {
               const wb = XLSX.utils.book_new();
               const ws = XLSX.utils.aoa_to_sheet(ExportHelper._getExcelData());
               XLSX.utils.book_append_sheet(wb, ws, "ตารางเวร");
               XLSX.writeFile(wb, `ตารางเวร_${record.date}.csv`, { bookType: 'csv' });
           }
       };
   },

   // --- AFFILIATIONS & SETTINGS ---
   affiliations: () => {
       UI.title.innerText = 'จัดการสังกัด / จุดเวร';
       const renderList = () => {
           let html = `<div class="mb-4 text-right"><button onclick="showAffForm()" class="bg-primary text-white px-4 py-2 rounded shadow"><i class="fas fa-plus mr-2"></i>เพิ่มสังกัด</button></div>
           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;
           
           DB.data.affiliations.forEach(a => {
               html += `
               <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border-l-4 ${a.isDefault ? 'border-primary' : 'border-gray-300 dark:border-gray-600'}">
                   <div class="flex justify-between items-start mb-3">
                       <div>
                           <h3 class="font-bold text-lg">${a.shortName} ${a.isDefault ? '<span class="text-xs bg-primary text-white px-2 py-1 rounded ml-2">ค่าเริ่มต้น</span>' : ''}</h3>
                           <p class="text-sm text-gray-500">${a.fullName}</p>
                       </div>
                       <button onclick="showAffForm('${a.id}')" class="text-blue-500 hover:text-blue-700"><i class="fas fa-edit"></i></button>
                   </div>
                   <div class="text-sm text-gray-600 dark:text-gray-400">
                       <strong>จุดเข้าเวร (${a.points.length}):</strong><br>
                       ${a.points.slice(0, 3).map(pt => `- ${pt.name} (${pt.capacity === 999 ? 'ไม่จำกัด' : pt.capacity + ' คน'})`).join('<br>')}
                       ${a.points.length > 3 ? '<br><i>...และอื่นๆ</i>' : ''}
                   </div>
               </div>`;
           });
           html += `</div>`;
           UI.container.innerHTML = html;
       };

       window.showAffForm = (editId = null) => {
           const a = editId ? JSON.parse(JSON.stringify(DB.data.affiliations.find(x => x.id === editId))) : {
               shortName: '', fullName: '', isDefault: false, points: [{ id: Utils.generateId(), name: '', capacity: 1 }]
           };
           const mId = 'form-aff';
           UI.showModal(`
               <h3 class="text-xl font-bold mb-4">${editId ? 'แก้ไขสังกัด' : 'เพิ่มสังกัด'}</h3>
               <div class="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                   <div><label class="text-sm font-bold">ชื่อย่อสังกัด</label><input type="text" id="af_short" value="${a.shortName}" class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"></div>
                   <div><label class="text-sm font-bold">ชื่อเต็มสังกัด</label><input type="text" id="af_full" value="${a.fullName}" class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"></div>
                   
                   <div class="flex items-center gap-2 mt-2">
                       <input type="checkbox" id="af_default" ${a.isDefault ? 'checked' : ''} class="w-5 h-5 text-primary rounded">
                       <label for="af_default" class="font-bold">ตั้งเป็นสังกัดค่าเริ่มต้น</label>
                   </div>

                   <hr class="dark:border-gray-600 my-4">
                   <h4 class="font-bold">จุดเข้าเวร (สามารถเลื่อนจัดลำดับได้)</h4>
                   <div id="pt-list" class="space-y-2 pb-4">
                       ${a.points.map((pt) => `
                           <div class="flex gap-2 items-center bg-gray-50 dark:bg-gray-700 p-2 rounded pt-item" data-id="${pt.id}">
                               <i class="fas fa-grip-vertical text-gray-400 cursor-move text-xl p-2 touch-none"></i>
                               <input type="text" value="${pt.name}" placeholder="ชื่อจุด" class="flex-1 p-1 border rounded dark:bg-gray-600 dark:border-gray-500 pt-name">
                               <input type="number" value="${pt.capacity === 999 ? '' : pt.capacity}" placeholder="ไม่จำกัด" class="w-20 p-1 border rounded dark:bg-gray-600 dark:border-gray-500 pt-cap">
                               <button onclick="removePt(this)" class="text-danger p-1"><i class="fas fa-times"></i></button>
                           </div>
                       `).join('')}
                   </div>
                   <button id="btn-add-pt" class="text-primary text-sm mt-2"><i class="fas fa-plus mr-1"></i> เพิ่มจุดเข้าเวร</button>
               </div>
               <div class="mt-6 flex justify-end gap-2">
                   <button onclick="UI.closeModal('${mId}')" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">ยกเลิก</button>
                   <button id="btn-save-aff" class="px-4 py-2 bg-primary text-white rounded">บันทึก</button>
               </div>
           `, mId);

           new Sortable(document.getElementById('pt-list'), { animation: 150, handle: '.cursor-move' });

           document.getElementById('btn-add-pt').onclick = () => {
               const div = document.createElement('div');
               div.className = "flex gap-2 items-center bg-gray-50 dark:bg-gray-700 p-2 rounded pt-item";
               div.dataset.id = Utils.generateId();
               div.innerHTML = `<i class="fas fa-grip-vertical text-gray-400 cursor-move text-xl p-2 touch-none"></i><input type="text" placeholder="ชื่อจุด" class="flex-1 p-1 border rounded dark:bg-gray-600 dark:border-gray-500 pt-name"><input type="number" placeholder="คน" class="w-20 p-1 border rounded dark:bg-gray-600 dark:border-gray-500 pt-cap"><button onclick="removePt(this)" class="text-danger p-1"><i class="fas fa-times"></i></button>`;
               document.getElementById('pt-list').appendChild(div);
           };
           window.removePt = (btn) => btn.closest('.pt-item').remove();

           document.getElementById('btn-save-aff').onclick = () => {
               const sName = document.getElementById('af_short').value.trim();
               const fName = document.getElementById('af_full').value.trim();
               const isDef = document.getElementById('af_default').checked;
               
               const pts = [];
               document.querySelectorAll('.pt-item').forEach(el => {
                   const name = el.querySelector('.pt-name').value.trim();
                   const cap = el.querySelector('.pt-cap').value ? parseInt(el.querySelector('.pt-cap').value) : 999;
                   if(name) pts.push({ id: el.dataset.id, name, capacity: cap });
               });

               if(!sName || pts.length === 0) return UI.alert('ข้อผิดพลาด', 'กรุณากรอกชื่อย่อสังกัด และต้องมีจุดเข้าเวรอย่างน้อย 1 จุด');

               UI.confirm('ยืนยันการบันทึก', 'ต้องการบันทึกข้อมูลสังกัดนี้หรือไม่?', () => {
                   if(isDef) DB.data.affiliations.forEach(x => x.isDefault = false);
                   if (editId) {
                       const target = DB.data.affiliations.find(x => x.id === editId);
                       target.shortName = sName; target.fullName = fName; target.isDefault = isDef; target.points = pts;
                   } else {
                       DB.data.affiliations.push({ id: Utils.generateId(), shortName: sName, fullName: fName, isDefault: isDef, points: pts });
                   }
                   if(!DB.data.affiliations.find(x => x.isDefault) && DB.data.affiliations.length > 0) DB.data.affiliations[0].isDefault = true;
                   DB.save(); UI.closeModal(mId); renderList();
               });
           };
       };
       renderList();
   },

   settings: () => {
       UI.title.innerText = 'ตั้งค่าระบบ';
       UI.container.innerHTML = `
           <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 max-w-lg mx-auto">
               <div class="flex justify-between items-center mb-6">
                   <div>
                       <h3 class="font-bold text-lg">โหมดหน้าจอ (Theme)</h3>
                       <p class="text-sm text-gray-500">เลือกรูปแบบสีของแอปพลิเคชัน</p>
                   </div>
                   <select id="sel-theme" class="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 bg-transparent">
                       <option value="system" ${DB.data.theme === 'system' ? 'selected' : ''}>อัตโนมัติ (System)</option>
                       <option value="light" ${DB.data.theme === 'light' ? 'selected' : ''}>สว่าง (Light)</option>
                       <option value="dark" ${DB.data.theme === 'dark' ? 'selected' : ''}>มืด (Dark)</option>
                   </select>
               </div>
               <hr class="dark:border-gray-700 my-6">
               <div class="text-center text-gray-400 text-sm">
                   <p>ระบบจัดเวร บก. v1.1.0 (Modularized)</p>
               </div>
           </div>
       `;
       document.getElementById('sel-theme').onchange = (e) => {
           DB.data.theme = e.target.value;
           DB.save(); Utils.applyTheme();
       };
   }
};