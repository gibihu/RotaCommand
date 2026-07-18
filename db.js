// ==========================================
// DATA LAYER (LocalStorage)
// ==========================================
const DB_KEY = 'military_shift_db';
const DEFAULT_SCHEMA = {
    isFirstRun: true,
    theme: 'system',
    affiliations: [],
    personnel: [],
    draftSelection: [],
    schedules: []
};

const DB = {
    data: {},
    load: () => {
        const stored = localStorage.getItem(DB_KEY);
        DB.data = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(DEFAULT_SCHEMA));
    },
    save: () => {
        localStorage.setItem(DB_KEY, JSON.stringify(DB.data));
    },
    initFirstRun: (choice) => {
        DB.data.isFirstRun = false;
        if (choice === 'ศสพ') {
            DB.data.affiliations.push({
                id: 'aff_' + Date.now(),
                shortName: 'ศสพ.',
                fullName: 'ศูนย์สงครามพิเศษ',
                isDefault: true,
                points: [
                    { id: 'pt_1', name: 'หน้าค่าย', capacity: 5 },
                    { id: 'pt_2', name: 'ที่ตั้งกองรักษาการ (คน/ปืน)', capacity: 5 },
                    { id: 'pt_3', name: 'หน้าบ้าน ผล.นสศ.', capacity: 5 },
                    { id: 'pt_4', name: 'คลังกระสุน', capacity: 5 },
                    { id: 'pt_5', name: 'ตรวจรถ', capacity: 5 },
                    { id: 'pt_special', name: 'เฉพาะกิจ (ฉก.)', capacity: 999 }
                ]
            });
        } else {
            DB.data.affiliations.push({
                id: 'aff_' + Date.now(),
                shortName: 'ไม่มีชื่อ',
                fullName: 'สังกัดไม่มีชื่อ',
                isDefault: true,
                points: [
                    { id: 'pt_1', name: 'จุดเข้าเวร', capacity: 1 },
                    { id: 'pt_special', name: 'เฉพาะกิจ (ฉก.)', capacity: 999 }
                ]
            });
        }
        DB.save();
    },
    getDefaultAffiliation: () => DB.data.affiliations.find(a => a.isDefault) || DB.data.affiliations[0]
};
