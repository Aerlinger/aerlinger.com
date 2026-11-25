// Theme toggle -------------------------------------------------------------
(function () {
  var root = document.documentElement;
  var btn = document.querySelector(".theme-toggle");
  if (!btn) return;
  var media = window.matchMedia("(prefers-color-scheme: dark)");
  function current() { return root.dataset.theme || (media.matches ? "dark" : "light"); }
  function sync() { btn.setAttribute("aria-pressed", String(current() === "dark")); }
  btn.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    sync();
  });
  sync();
})();

// Reading progress fallback (browsers without CSS scroll timelines) --------
(function () {
  var bar = document.querySelector(".progress");
  if (!bar || (window.CSS && CSS.supports("animation-timeline: scroll()"))) return;
  var ticking = false;
  function update() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

// Search -------------------------------------------------------------------
(function () {
  var input = document.getElementById("search-input");
  var out = document.getElementById("search-results");
  if (!input || !out) return;

  var index = null;
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var highlight = function (text, terms) {
    var html = esc(text);
    terms.forEach(function (t) {
      var re = new RegExp("(" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
      html = html.replace(re, "<mark>$1</mark>");
    });
    return html;
  };
  var snippet = function (text, term) {
    var i = text.toLowerCase().indexOf(term);
    if (i < 0) return "";
    var start = Math.max(0, i - 60);
    return (start > 0 ? "…" : "") + text.slice(start, i + 100) + "…";
  };

  function render() {
    var q = input.value.trim().toLowerCase();
    var url = new URL(location.href);
    if (q) url.searchParams.set("q", input.value.trim()); else url.searchParams.delete("q");
    history.replaceState(null, "", url);

    if (!q || !index) { out.innerHTML = ""; return; }
    var terms = q.split(/\s+/).filter(Boolean);
    var hits = index.filter(function (p) {
      var hay = (p.title + " " + p.tags.join(" ") + " " + p.content).toLowerCase();
      return terms.every(function (t) { return hay.indexOf(t) !== -1; });
    });
    if (!hits.length) {
      out.innerHTML = '<li class="search-empty">No posts match “' + esc(input.value.trim()) + '”.</li>';
      return;
    }
    out.innerHTML = hits.map(function (p) {
      var snip = p.title.toLowerCase().indexOf(terms[0]) === -1 ? snippet(p.content, terms[0]) : "";
      return '<li><a class="post-link" href="' + esc(p.url) + '"><span><span class="post-link-title">' +
        highlight(p.title, terms) + "</span>" +
        (snip ? '<span class="post-snippet">' + highlight(snip, terms) + "</span>" : "") +
        '</span><time datetime="' + esc(p.iso) + '">' + esc(p.date) + "</time></a></li>";
    }).join("");
  }

  fetch(input.dataset.index)
    .then(function (r) { return r.json(); })
    .then(function (data) { index = data; render(); })
    .catch(function () { out.innerHTML = '<li class="search-empty">Search is unavailable right now.</li>'; });

  var initial = new URLSearchParams(location.search).get("q");
  if (initial) input.value = initial;
  input.addEventListener("input", render);
})();
