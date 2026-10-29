// The landing page: the three-beat rail, the page switch, reveal motion and the two preview panels.
// Every client, E2E test id, run id and count in the preview panels is invented; "Client A" stands in for any customer.
window.siteReady = true;
const BRIDGE = {
  doneBy: "All done by 4:40 PM",
  panes: [
    { key: "you", label: "Needs you", rows: [
      { c: "you", t: "Approve the fix for bil-19, the coupon total", why: "Client A · proven: clean local run + platform run, same code", tm: "12m",
        d: [["What broke", "The cart redesign renamed the total field, so the E2E test read an empty value."], ["Proof", "Local pass in 6m 23s · platform run r-4821 passed · same code"], ["Your call", "Apply it: the fix touches a shared page object"]] },
      { c: "you", t: "Decide: product change or bug? srch-02", why: "Client B · search now sorts by date; the written steps expect relevance", tm: "31m",
        d: [["Evidence", "Two settled failures, one on the platform, no pass between"], ["Agent's pick", "Bug: no release note mentions a sort change"], ["Your call", "Bug, product change, or skip"]] } ] },
    { key: "run", label: "Running now", rows: [
      { c: "run", t: "Lead · Client A: 14 failures in 3 groups", why: "2 fixes in proof, 1 group re-running first", tm: "41m",
        d: [["Owns", "Every failure for Client A, end to end"], ["Next", "Platform run for group 2, then the fix goes to Needs you"]] },
      { c: "run", t: "Lead · Client B: 9 failures", why: "Re-run first: 6 passed with no change", tm: "18m",
        d: [["Owns", "Every failure for Client B"], ["Next", "Trace the 3 that failed twice"]] },
      { c: "run", t: "Worker · creating 6 E2E tests for onboarding", why: "4 proven: every written step maps to an assertion seen passing", tm: "1h 05m",
        d: [["Bar", "Two local passes and two platform passes, each step covered"], ["Next", "The last 2 tests, then a second agent reviews all 6"]] },
      { c: "run", t: "Worker · reviewing a teammate's E2E test", why: "A second agent is challenging the verdict", tm: "7m",
        d: [["Reads", "The code, its trace, its video and the written steps"], ["Writes", "A short summary and a note for the teammate"]] } ] },
    { key: "wait", label: "Waiting", rows: [
      { c: "wait", t: "Lead · Client C: waiting on platform run r-4830", why: "The run finishes in about 6 minutes; the lead wakes when it does", tm: "3m",
        d: [["Waiting on", "A run on the platform's own machines"], ["Then", "A pass moves the fix to Needs you"]] } ] },
    { key: "done", label: "Done today", rows: [
      { c: "done", t: "acc-07 fixed and proven on two runs", why: "Client A", tm: "9:12 AM", d: [["Proof", "Local pass · platform run r-4790"]] },
      { c: "done", t: "6 E2E tests created for billing, every step proven", why: "Client B", tm: "10:40 AM", d: [["Proof", "12 runs, 0 failures"]] },
      { c: "done", t: "chk-04 passed on re-run, no change needed", why: "Client A", tm: "11:05 AM", d: [["Why no fix", "It failed only under the morning's full-suite load"]] },
      { c: "done", t: "Bug report filed for exp-02, the empty export", why: "Client C · one key, not 20 to 30 minutes", tm: "11:30 AM", d: [["Evidence", "Steps, expected, actual, trace frame"]] } ] } ]
};
const MC = {
  title: "Client A · this morning's suite run",
  verdict: "42 E2E tests failed this morning. 31 passed on a plain re-run. The other 11 are worked below.",
  nums: [["42", "failed"], ["31", "passed on re-run"], ["8", "fixed"], ["3", "need you"]],
  groups: [
    ["Group 1", "6 failures · the cart total field was renamed", "ok", "fixed, proven"],
    ["Group 2", "2 failures · a menu moved into a new panel", "wk", "fix in proof"],
    ["Group 3", "2 failures · the export file comes back empty", "bug", "bug: report ready"],
    ["Group 4", "1 failure · search sort order changed", "ask", "your call"] ]
};


function el(h) { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstElementChild; }
function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

function drawBridge(host, opts) {
  const o = opts || {};
  const vit = BRIDGE.panes.map((p) => `<span>${p.label} <b>${p.rows.length}</b></span>`).join("") + `<span>${BRIDGE.doneBy}</span>`;   // counts read off the rows, so the top line and the tabs never disagree
  const tabs = BRIDGE.panes.map((p, i) => `<button type="button" class="tab${i ? "" : " on"}" data-tab="${p.key}">${p.label}<span class="c">${p.rows.length}</span></button>`).join("");
  const panes = BRIDGE.panes.map((p, i) => `<div class="pane${i ? "" : " on"}" data-pane="${p.key}">` + p.rows.map((r, j) =>
    `<div class="row ${r.c}" data-row="${p.key}${j}"><span class="ic"></span><div><div class="tt">${esc(r.t)}</div><div class="why">${esc(r.why)}</div></div><span class="tm">${r.tm}</span></div>` +
    `<div class="detail" data-detail="${p.key}${j}"><dl>${r.d.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join("")}</dl></div>`).join("") + `</div>`).join("");
  host.innerHTML = `<div class="frame" data-frame="bridge"><div class="bar"><span class="dot"></span>The Bridge<span class="demo">invented data</span></div>` +
    `<div class="vit">${vit}</div><div class="tabs">${tabs}</div><div data-panes>${panes}</div></div>`;
  wireTabs(host);
  host.querySelectorAll(".row").forEach((r) => r.addEventListener("click", () => {
    const d = host.querySelector(`[data-detail="${r.dataset.row}"]`); const on = !d.classList.contains("on");
    host.querySelectorAll(".detail").forEach((x) => x.classList.remove("on")); host.querySelectorAll(".row").forEach((x) => x.classList.remove("sel"));
    if (on) { d.classList.add("on"); r.classList.add("sel"); }
  }));
  if (o.open) host.querySelector(".row").click();
}

function drawMC(host) {
  host.innerHTML = `<div class="frame" data-frame="mc"><div class="bar"><span class="dot"></span>Investigations · ${esc(MC.title)}<span class="demo">invented data</span></div>` +
    `<div class="verdict"><div class="vl">${esc(MC.verdict)}</div><div class="nums">${MC.nums.map(([n, l]) => `<div><b>${n}</b><span>${l}</span></div>`).join("")}</div></div>` +
    MC.groups.map(([g, t, k, s]) => `<div class="grp"><span class="gn">${g}</span><span>${esc(t)}</span><span class="gs ${k}">${s}</span></div>`).join("") + `</div>`;
}

function wireTabs(scope) {
  scope.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => {
    const f = b.closest(".frame"); f.querySelectorAll(".tab").forEach((x) => x.classList.toggle("on", x === b));
    f.querySelectorAll(".pane").forEach((p) => p.classList.toggle("on", p.dataset.pane === b.dataset.tab));
  }));
}

function wireRail() {   // the chapter rail: the beat whose top has passed 40% of the screen is the current one; the line fills with progress
  const items = [...document.querySelectorAll("[data-go]")], beats = [...document.querySelectorAll(".beat")];
  const fill = document.querySelector("[data-rail-fill]"), box = document.querySelector(".beats");
  const set = (n) => items.forEach((i) => i.classList.toggle("on", i.dataset.go === n));
  const onScroll = () => {
    const mid = innerHeight * 0.4; let cur = "1";
    beats.forEach((b) => { if (b.getBoundingClientRect().top < mid) cur = b.dataset.beat; });
    set(cur);
    const r = box.getBoundingClientRect(); fill.style.height = (Math.min(1, Math.max(0, (mid - r.top) / r.height)) * 100) + "%";
  };
  items.forEach((i) => i.addEventListener("click", () => set(i.dataset.go)));
  addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); onScroll();
}

function wireSwitch() {   // see it running: one device, two pages
  const btns = document.querySelectorAll("[data-show]");
  btns.forEach((b) => b.addEventListener("click", () => {
    btns.forEach((x) => { const on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-selected", String(on)); });
    document.querySelectorAll("[data-screen]").forEach((s) => s.classList.toggle("on", s.dataset.screen === b.dataset.show));
  }));
}

function wireMotion() {   // reveals and the device settling flat run once each; with reduced motion nothing is hidden or tilted
  const top = document.querySelector("[data-top]");
  const onScroll = () => top.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if (!document.documentElement.classList.contains("motion")) return;
  if (!("IntersectionObserver" in window)) { document.documentElement.classList.remove("motion"); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
  document.querySelectorAll("[data-reveal],[data-stage]").forEach((n) => io.observe(n));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-demo="bridge"]').forEach((h) => drawBridge(h, { open: true }));
  document.querySelectorAll('[data-demo="mc"]').forEach((h) => drawMC(h));
  wireRail(); wireSwitch(); wireMotion();
});
