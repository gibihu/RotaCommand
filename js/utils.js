const Utils = {
    generateId: () => '_' + Math.random().toString(36).substr(2, 9),
    applyTheme: () => {
        const theme = DB.data.theme;
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.add(prefersDark ? 'dark' : 'light');
        } else {
            root.classList.add(theme);
        }
    },
    formatDate: (dateStr) => new Date(dateStr).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
};
