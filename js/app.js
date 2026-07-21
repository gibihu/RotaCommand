// เปลี่ยนเป็น async function เพื่อรอโหลด File Handle
const initApp = async () => {
    await DB.load();
    Utils.applyTheme();
    if (DB.data.isFirstRun) {
        const mId = 'first-run-modal';
        UI.showModal(`<h2 class="text-2xl font-bold text-primary mb-4 text-center">ยินดีต้อนรับ</h2><div class="space-y-3"><button onclick="startApp('ศสพ')" class="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl shadow">ศสพ. (ศูนย์สงครามพิเศษ)</button><button onclick="startApp('อื่นๆ')" class="w-full bg-gray-200 font-bold py-3 px-4 rounded-xl shadow">เพิ่มภายหลัง</button></div>`, mId);
        window.startApp = (choice) => { DB.initFirstRun(choice); UI.closeModal(mId); UI.navigate('home'); };
    } else { 
        UI.navigate('home'); 
    }
};
initApp();
