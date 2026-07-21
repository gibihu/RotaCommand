window.Views.settings = () => {
    UI.title.innerText = 'ตั้งค่าระบบ';
    
    const isFileSystemSupported = 'showOpenFilePicker' in window;
    // แสดงชื่อไฟล์ที่จำไว้ หรือแสดงข้อความเตือนถ้ายังไม่มี
    const currentFileName = DB.fileHandle ? DB.fileHandle.name : 'ยังไม่ได้ตั้งค่า (กดเลือกตำแหน่ง)';

    UI.container.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 max-w-lg mx-auto space-y-6">
            
            <div class="flex justify-between items-center border-b pb-4 dark:border-gray-700">
                <div><h3 class="font-bold text-lg">โหมดหน้าจอ</h3></div>
                <select id="sel-theme" class="p-2 border rounded dark:bg-gray-700 bg-transparent">
                    <option value="system" ${DB.data.theme === 'system' ? 'selected' : ''}>อัตโนมัติ</option>
                    <option value="light" ${DB.data.theme === 'light' ? 'selected' : ''}>สว่าง</option>
                    <option value="dark" ${DB.data.theme === 'dark' ? 'selected' : ''}>มืด</option>
                </select>
            </div>
            
            ${isFileSystemSupported ? `
            <div class="border-b pb-4 dark:border-gray-700">
                <div class="flex justify-between items-center mb-4">
                    <div><h3 class="font-bold text-lg">ที่เก็บข้อมูล</h3><p class="text-xs text-gray-500">เลือกบันทึกข้อมูลแบบไฟล์</p></div>
                    <select id="sel-storage" class="p-2 border rounded dark:bg-gray-700 bg-transparent">
                        <option value="browser" ${DB.data.settings.storageMode === 'browser' ? 'selected' : ''}>Browser (Local)</option>
                        <option value="file" ${DB.data.settings.storageMode === 'file' ? 'selected' : ''}>File (JSON)</option>
                    </select>
                </div>
                
                <div id="file-options" class="${DB.data.settings.storageMode === 'file' ? '' : 'hidden'} space-y-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    
                    <!-- ส่วนแสดงตำแหน่งไฟล์ และปุ่มเลือกไฟล์ -->
                    <div class="bg-white dark:bg-gray-800 p-3 rounded border dark:border-gray-600 flex justify-between items-center">
                        <div class="flex-1 overflow-hidden pr-2">
                            <span class="text-xs text-gray-500 block">ไฟล์เชื่อมต่อปัจจุบัน:</span>
                            <span id="txt-filename" class="font-bold text-primary truncate block">${currentFileName}</span>
                        </div>
                        <button id="btn-pick-file" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 px-3 py-2 rounded text-sm transition shrink-0 whitespace-nowrap">
                            <i class="fas fa-search mr-1"></i> เลือกระบุไฟล์
                        </button>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-2 mt-2">
                        <button id="btn-load-file" class="flex-1 bg-green-600 hover:bg-green-700 text-white p-2 rounded transition shadow-sm"><i class="fas fa-download mr-2"></i>ดึงข้อมูลจากไฟล์</button>
                        <button id="btn-save-file" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition shadow-sm"><i class="fas fa-upload mr-2"></i>อัปเดตไฟล์นี้</button>
                    </div>

                    <div class="flex justify-between items-center pt-2 border-t dark:border-gray-600 mt-2">
                        <span class="text-sm font-bold">บันทึกอัตโนมัติ (Auto Save)</span>
                        <select id="sel-autosave" class="p-1 border rounded dark:bg-gray-600 text-sm">
                            <option value="off" ${DB.data.settings.autoSave === 'off' ? 'selected' : ''}>ปิด</option>
                            <option value="1" ${DB.data.settings.autoSave === '1' ? 'selected' : ''}>1 นาที</option>
                            <option value="3" ${DB.data.settings.autoSave === '3' ? 'selected' : ''}>3 นาที</option>
                            <option value="5" ${DB.data.settings.autoSave === '5' ? 'selected' : ''}>5 นาที</option>
                            <option value="10" ${DB.data.settings.autoSave === '10' ? 'selected' : ''}>10 นาที</option>
                            <option value="30" ${DB.data.settings.autoSave === '30' ? 'selected' : ''}>30 นาที</option>
                            <option value="sync" ${DB.data.settings.autoSave === 'sync' ? 'selected' : ''}>ซิงค์ (ทุก 2 วิ)</option>
                        </select>
                    </div>
                    <p class="text-xs text-red-500">* หลังรีเฟรชเว็บเบราว์เซอร์ หากคุณกด โหลด/บันทึก ข้อมูล ระบบจะเด้ง Pop-up เล็กๆ ขออนุญาตยืนยันการเข้าถึงไฟล์เป้าหมาย 1 ครั้งเพื่อความปลอดภัย</p>
                </div>
            </div>
            ` : `
            <div class="border-b pb-4 dark:border-gray-700">
                <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-500 italic">
                    <i class="fas fa-info-circle mr-2"></i>อุปกรณ์นี้ไม่รองรับระบบ File System Access (ข้อมูลจะถูกจัดเก็บใน Browser เท่านั้น)
                </div>
            </div>
            `}
            
            <div class="pt-2">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-bold text-lg text-danger">ล้างข้อมูลทั้งหมด (Restore)</h3>
                        <p class="text-xs text-gray-500">คืนค่าระบบกลับไปเหมือนเพิ่งเริ่มใช้งาน</p>
                    </div>
                    <button id="btn-factory-reset" class="bg-danger hover:bg-red-600 text-white px-4 py-2 rounded shadow transition">
                        <i class="fas fa-trash-alt mr-2"></i>รีเซ็ตระบบ
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('sel-theme').onchange = (e) => { DB.data.theme = e.target.value; DB.save(); Utils.applyTheme(); };
    
    if (isFileSystemSupported) {
        document.getElementById('sel-storage').onchange = (e) => {
            DB.data.settings.storageMode = e.target.value; DB.save(); DB.applyAutoSave();
            document.getElementById('file-options').classList.toggle('hidden', e.target.value !== 'file');
        };

        // ปุ่มเลือกระบุไฟล์
        document.getElementById('btn-pick-file').onclick = async () => {
            const success = await DB.pickFileLocation();
            if(success && DB.fileHandle) {
                document.getElementById('txt-filename').innerText = DB.fileHandle.name;
                // เซฟให้หนึ่งครั้งเมื่อเลือกไฟล์เสร็จ เพื่อให้ไฟล์มีโครงสร้างล่าสุด
                await DB.saveToFile(); 
                UI.alert('สำเร็จ', `เชื่อมต่อและบันทึกโครงสร้างลงไฟล์ "${DB.fileHandle.name}" เรียบร้อยแล้ว`);
            }
        };
        
        document.getElementById('sel-autosave').onchange = (e) => { DB.data.settings.autoSave = e.target.value; DB.save(); DB.applyAutoSave(); };
        
        document.getElementById('btn-load-file').onclick = () => {
            if (!DB.fileHandle) return UI.alert('แจ้งเตือน', 'กรุณากดปุ่ม "เลือกระบุไฟล์" ก่อนครับ');
            UI.confirm('คำเตือน', 'ข้อมูลในระบบจะถูกเขียนทับด้วยข้อมูลจากไฟล์ แน่ใจหรือไม่?', async () => {
                const success = await DB.loadFromFile();
                if(success) UI.alert('สำเร็จ', 'โหลดและทับข้อมูลลงระบบแล้ว');
            });
        };
        
        document.getElementById('btn-save-file').onclick = async () => {
            if (!DB.fileHandle) return UI.alert('แจ้งเตือน', 'กรุณากดปุ่ม "เลือกระบุไฟล์" ก่อนครับ');
            const success = await DB.saveToFile();
            if(success) UI.alert('สำเร็จ', 'บันทึกข้อมูลทับไฟล์ต้นฉบับเรียบร้อย');
        };
    }

    document.getElementById('btn-factory-reset').onclick = () => {
        UI.confirm('ยืนยันการล้างข้อมูล (1/2)', 'คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมด?', () => {
            setTimeout(() => {
                UI.confirm('ยืนยันขั้นสุดท้าย (2/2)', 'การกระทำนี้ไม่สามารถย้อนกลับได้ แน่ใจที่จะล้างข้อมูลใช่หรือไม่?', () => {
                    localStorage.removeItem(DB_KEY);
                    location.reload(); 
                }, 'ลบข้อมูลถาวร', 'ยกเลิก', true);
            }, 300);
        }, 'ดำเนินการต่อ', 'ยกเลิก', true);
    };
};
