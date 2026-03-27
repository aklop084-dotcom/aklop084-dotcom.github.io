// js/theme.js
const toggleSwitch = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    toggleSwitch.checked = true;
}

function switchTheme(e) {
    if (e.target.checked) {
        document.body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
    }
}

toggleSwitch.addEventListener('change', switchTheme);