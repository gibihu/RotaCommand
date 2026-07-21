const DB_KEY = 'military_shift_db';

const DEFAULT_SCHEMA = { 
    isFirstRun: true, 
    theme: 'system', 
    affiliations: [], 
    personnel: [], 
    draftSelection: [], 
    schedules: [], 
    settings: { storageMode: 'browser', autoSave: 'off' } 
};

// --- ฐานข้อมูล IndexedDB สำหรับเก็บตำแหน่งไฟล์ (File Handle) ---
const IDB = {
    init: () => new Promise((resolve, reject) => {
        const req = indexedDB.open('ShiftDB_Files', 1);
        req.onupgradeneeded = e => e.target.result.createObjectStore('handles');
        req.onsuccess = e => resolve(e.target.result);
        req.onerror = () => reject('IDB Error');
    }),
    saveHandle: async (handle) => {
        const db = await IDB.init();
        db.transaction('handles', 'readwrite').objectStore('handles').put(handle, 'mainFile');
    },
    getHandle: async () => {
        const db = await IDB.init();
        return new Promise(resolve => {
            const req = db.transaction('handles', 'readonly').objectStore('handles').get('mainFile');
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => resolve(null);
        });
    }
};

const DB = {
    data: {},
    fileHandle: null,
    autoSaveInterval: null,
    
    load: async () => {
        const stored = localStorage.getItem(DB_KEY);
        DB.data = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(DEFAULT_SCHEMA));
        
        if(!DB.data.settings) {
            DB.data.settings = { storageMode: 'browser', autoSave: 'off' };
        }
        
        if('showOpenFilePicker' in window) {
            DB.fileHandle = await IDB.getHandle();
        }
        
        DB.applyAutoSave();
    },
    
    save: () => {
        localStorage.setItem(DB_KEY, JSON.stringify(DB.data));
    },

    pickFileLocation: async () => {
        try {
            const handle = await window.showSaveFilePicker({ 
                suggestedName: 'shift_data.json',
                types: [{ description: 'JSON Database', accept: { 'application/json': ['.json'] } }] 
            });
            DB.fileHandle = handle;
            await IDB.saveHandle(handle);
            return true;
        } catch (e) { 
            console.error('ผู้ใช้ยกเลิกการเลือกไฟล์:', e); 
            return false; 
        }
    },

    verifyFilePermission: async () => {
        if (!DB.fileHandle) return false;
        const opts = { mode: 'readwrite' };
        if ((await DB.fileHandle.queryPermission(opts)) === 'granted') return true;
        if ((await DB.fileHandle.requestPermission(opts)) === 'granted') return true;
        return false;
    },
    
    saveToFile: async (isAutoSave = false) => {
        try {
            if (!DB.fileHandle) return false;
            
            const hasPermission = await DB.verifyFilePermission();
            if (!hasPermission) {
                if (!isAutoSave) alert('ไม่ได้รับสิทธิ์ในการเข้าถึง/เขียนไฟล์');
                return false;
            }

            const writable = await DB.fileHandle.createWritable();
            await writable.write(JSON.stringify(DB.data));
            await writable.close();
            return true;
        } catch (e) { 
            console.error('Save to File Error:', e); 
            return false; 
        }
    },
    
    loadFromFile: async () => {
        try {
            if (!DB.fileHandle) {
                alert('ยังไม่ได้ตั้งค่าตำแหน่งไฟล์ กรุณาไปที่ "เลือกระบุไฟล์" ก่อนครับ');
                return false;
            }
            
            const hasPermission = await DB.verifyFilePermission();
            if (!hasPermission) return false;

            const file = await DB.fileHandle.getFile();
            const contents = await file.text();
            DB.data = JSON.parse(contents);
            DB.save();
            return true;
        } catch (e) { 
            console.error('Load from File Error:', e); 
            return false; 
        }
    },

    applyAutoSave: () => {
        if(DB.autoSaveInterval) clearInterval(DB.autoSaveInterval);
        const mode = DB.data.settings.autoSave;
        
        if(mode !== 'off' && DB.data.settings.storageMode === 'file') {
            const ms = mode === 'sync' ? 2000 : parseInt(mode) * 60000;
            DB.autoSaveInterval = setInterval(() => {
                if(DB.fileHandle) DB.saveToFile(true); 
            }, ms);
        }
    },

    initFirstRun: (choice) => {
        DB.data.isFirstRun = false;
        if (choice === 'ศสพ') {
            DB.data.affiliations.push({
                id: 'aff_' + Date.now(), shortName: 'ศสพ.', fullName: 'ศูนย์สงครามพิเศษ', isDefault: true,
                points: [
                    { id: 'pt_1', name: 'หน้าค่าย', capacity: 2, color: '#ef4444' },
                    { id: 'pt_2', name: 'คลังกระสุน', capacity: 2, color: '#3b82f6' },
                    { id: 'pt_3', name: 'ที่ตั่งกองรักษาการณ์(คน/ปืน)', capacity: 2, color: '#10b981' },
                    { id: 'pt_4', name: 'ตรวจรถ', capacity: 4, color: '#8b5cf6' },
                    { id: 'pt_5', name: 'หน้าบ้าน ผบ.นสศ', capacity: 4, color: '#8b5cf6' },
                    { id: 'pt_special', name: 'เฉพาะกิจ (ฉก.)', capacity: 999, color: '#eab308' }
                ]
            });
        } else {
            DB.data.affiliations.push({
                id: 'aff_' + Date.now(), shortName: 'ไม่มีชื่อ', fullName: 'สังกัดไม่มีชื่อ', isDefault: true,
                points: [{ id: 'pt_1', name: 'จุดเข้าเวร', capacity: 1, color: '#3b82f6' }]
            });
        }
        DB.save();
    },
    
    getDefaultAffiliation: () => DB.data.affiliations.find(a => a.isDefault) || DB.data.affiliations[0]
};
