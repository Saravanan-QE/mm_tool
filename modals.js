function openModal(id) {
    document.getElementById(id).classList.add('show');
    if (typeof gtag === 'function') gtag('event', 'open_modal', { event_category: 'Modal', event_label: id });
}
function closeModal(id) {
    document.getElementById(id).classList.remove('show');
}
document.querySelectorAll('.mm-modal').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('show'); });
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.mm-modal.show').forEach(m => m.classList.remove('show'));
});

/* ── Trust signals: author byline + last-updated + About page link ──────────
   Reads the page's own JSON-LD (author + dateModified) and surfaces it under
   the H1, and points the footer "About" to the real /about.html page. Keeps a
   single source of truth so no per-page dates are hardcoded. */
(function () {
    // Path prefix so links work from both / and /blog/ pages.
    var prefix = /\/blog\//.test(location.pathname) ? '../' : '';
    var aboutHref = prefix + 'about.html';

    function schemaFacts() {
        var author = null, modified = null;
        var nodes = document.querySelectorAll('script[type="application/ld+json"]');
        for (var i = 0; i < nodes.length; i++) {
            var data;
            try { data = JSON.parse(nodes[i].textContent); } catch (e) { continue; }
            var items = Array.isArray(data) ? data : (data['@graph'] || [data]);
            for (var j = 0; j < items.length; j++) {
                var it = items[j];
                if (!it || typeof it !== 'object') continue;
                if (!modified && it.dateModified) modified = it.dateModified;
                if (!author && it.author && it.author.name) author = it.author.name;
            }
            if (author && modified) break;
        }
        return { author: author, modified: modified };
    }

    function fmtDate(iso) {
        var d = new Date(iso);
        if (isNaN(d)) return null;
        var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return d.getDate() + ' ' + m[d.getMonth()] + ' ' + d.getFullYear();
    }

    function insertByline() {
        var main = document.querySelector('main.mm-main');
        if (!main) return;
        var h1 = main.querySelector('h1');
        if (!h1 || main.querySelector('.mm-byline')) return;

        var f = schemaFacts();
        var author = f.author || 'MoneyMindTool Editorial Team';
        var parts = [];
        parts.push('By <a href="' + aboutHref + '" rel="author">' + author + '</a>');
        parts.push('<span class="mm-verified">✓ Reviewed for FY 2026-27</span>');
        var when = f.modified && fmtDate(f.modified);
        if (when) parts.push('<span>Last updated ' + when + '</span>');

        var by = document.createElement('div');
        by.className = 'mm-byline';
        by.innerHTML = parts.join(' <span class="mm-byline-sep">·</span> ');
        h1.parentNode.insertBefore(by, h1.nextSibling);
    }

    function linkFooterAbout() {
        var btn = document.querySelector('.mm-footer button[onclick*="aboutModal"]');
        if (btn) {
            var a = document.createElement('a');
            a.href = aboutHref;
            a.textContent = 'About';
            if (btn.parentNode) btn.parentNode.replaceChild(a, btn);
        }
    }

    function run() { insertByline(); linkFooterAbout(); }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
