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

document.addEventListener('DOMContentLoaded', () => {
    function formatMathText(str) {
        const subs = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9','ₘ':'m','ₙ':'n','ₖ':'k'};
        const sups = {'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9'};
        
        let formatted = str.replace(/[₀-₉ₘₙₖ]+/g, m => '_{' + m.split('').map(c => subs[c]).join('') + '}');
        formatted = formatted.replace(/[⁰-⁹¹²³]+/g, m => '^{' + m.split('').map(c => sups[c]).join('') + '}');
        
        return formatted.replace(/·/g, '\\cdot ')
                        .replace(/\btg\b/g, '\\tan ')
                        .replace(/\bcos\b/g, '\\cos ')
                        .replace(/\bsin\b/g, '\\sin ')
                        .replace(/\.\.\./g, '\\dots ')
                        .replace(/−/g, '-');
    }

    document.querySelectorAll('.formula-block').forEach(b => {
        if(!b.innerHTML.includes('$$') && !b.innerHTML.includes('\\[')) {
            let inner = b.innerHTML.replace(/<br\s*\/?>/g, ' \\\\ ').replace(/&nbsp;/g, ' ');
            b.innerHTML = '\\[' + formatMathText(inner) + '\\]';
        }
    });

    document.querySelectorAll('.system-brace').forEach(b => {
        let lines = b.innerHTML.split(/<br\s*\/?>|\n/);
        let latexLines = [];
        for(let l of lines) {
            let p = l.replace(/[⎧⎨⎩⎪]/g, '').trim();
            if(p) latexLines.push(formatMathText(p));
        }
        if(latexLines.length > 0) {
            b.innerHTML = '\\[ \\begin{cases} ' + latexLines.join(' \\\\ ') + ' \\end{cases} \\]';
        }
    });

    document.querySelectorAll('.matrix-display, .matrix-block').forEach(b => {
        let htmlLines = b.innerHTML.split(/<br\s*\/?>|\n/);
        let latexLines = [];
        let after = '';
        for(let l of htmlLines) {
            let p = l.trim();
            if(!p) continue;
            
            if (p.includes('=')) {
                let parts = p.split('=');
                p = parts[0].trim();
                after = '=' + parts[1].trim();
            }
            
            p = p.replace(/^\|/, '').replace(/\|$/, '').trim();
            p = p.replace(/\s+y/g, ' & y').replace(/\s+z/g, ' & z');
            latexLines.push(formatMathText(p));
        }
        if(latexLines.length > 0) {
            b.innerHTML = '\\[ \\begin{vmatrix} ' + latexLines.join(' \\\\ ') + ' \\end{vmatrix} ' + formatMathText(after) + ' \\]';
        }
    });

    window.MathJax = {
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']],
            processEscapes: true
        },
        options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
        },
        startup: {
            ready: () => {
                MathJax.startup.defaultReady();
            }
        }
    };

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    document.head.appendChild(script);

    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        progressBar.style.width = scrolled + '%';
    });

    document.addEventListener('keydown', (e) => {
        const btns = Array.from(document.querySelectorAll('.ticket-navigation .nav-button'));
        if (e.key === 'ArrowLeft') {
            const prevBtn = btns.find(b => b.textContent.includes('←'));
            if (prevBtn && prevBtn.href) window.location.href = prevBtn.href;
        } else if (e.key === 'ArrowRight') {
            const nextBtn = btns.find(b => b.textContent.includes('→'));
            if (nextBtn && nextBtn.href) window.location.href = nextBtn.href;
        }
    });

    const sidebar = document.createElement('div');
    sidebar.className = 'global-sidebar';
    
    const sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'sidebar-overlay';

    const menuBtn = document.createElement('div');
    menuBtn.className = 'menu-toggle-btn';
    menuBtn.innerHTML = '<span></span><span></span><span></span>';

    const isPagesDir = window.location.pathname.includes('/pages/');
    const homeHref = isPagesDir ? '../index.html' : 'index.html';
    
    let linksHTML = '<h2>Все билеты</h2><div class="sidebar-links">';
    linksHTML += `<a href="${homeHref}" class="sidebar-link home-link">🏠 Главная страница</a>`;
    for (let i = 1; i <= 24; i++) {
        const isActive = isPagesDir && window.location.pathname.includes(`ticket${i}.html`);
        const itemHref = isPagesDir ? `ticket${i}.html` : `pages/ticket${i}.html`;
        linksHTML += `<a href="${itemHref}" class="sidebar-link ${isActive ? 'active' : ''}">Билет ${i}</a>`;
    }
    linksHTML += '</div>';
    
    sidebar.innerHTML = linksHTML;
    
    document.body.appendChild(menuBtn);
    document.body.appendChild(sidebarOverlay);
    document.body.appendChild(sidebar);

    const toggleSidebar = () => {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        menuBtn.classList.toggle('active');
    };

    menuBtn.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);
});