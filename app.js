// ==========================================
// APPLICATION STATE & INITIALIZATION
// ==========================================
let currentView = 'home';
let currentDraftData = null; // เก็บข้อมูลเวรที่กำลังจัดอยู่ชั่วคราว

const initApp = () => {
    DB.load();
    Utils.applyTheme();
    
    if (DB.data.isFirstRun) {
        const mId = 'first-run-modal';
        UI.showModal(`
            <h2 class="text-2xl font-bold text-primary mb-4 text-center">ยินดีต้อนรับ</h2>
            <p class="text-center text-gray-600 dark:text-gray-400 mb-6">กรุณาเลือกสังกัดเริ่มต้นของคุณ</p>
            <div class="space-y-3">
                <button onclick="startApp('ศสพ')" class="w-full bg-primary hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow transition">ศสพ. (ศูนย์สงครามพิเศษ)</button>
                <button onclick="startApp('อื่นๆ')" class="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-3 px-4 rounded-xl shadow transition">เพิ่มภายหลัง</button>
            </div>
        `, mId);
        window.startApp = (choice) => {
            DB.initFirstRun(choice);
            UI.closeModal(mId);
            UI.navigate('home');
        };
    } else {
        UI.navigate('home');
    }
};

// สั่งทำงานเมื่อโหลดไฟล์เสร็จ
initApp();
