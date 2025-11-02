// script.js
let allTools = [];
let savedTools = JSON.parse(localStorage.getItem("savedTools") || "[]");

async function loadTools() {
  const res = await fetch("tools.json");
  allTools = await res.json();
  renderCategories();
  renderTools(allTools);
  renderSaved();
}

function renderCategories() {
  const cats = [...new Set(allTools.map(t => t.category))];
  const catDiv = document.getElementById("categories");
  catDiv.innerHTML = cats.map(c => `<button onclick="filterByCategory('${c}')">${c}</button>`).join("");
}

function renderTools(tools) {
  const grid = document.getElementById("toolsGrid");
  grid.innerHTML = tools.map(t => `
    <div class="tool-card">
      <h4>${t.name}</h4>
      <p>${t.shortDescription}</p>
      <div class="tags">${t.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
      <button onclick="openTool('${t.url}')">Open</button>
      <button onclick="copyLink('${t.url}')">Copy Link</button>
      <button onclick="toggleSave('${t.id}')">${savedTools.includes(t.id) ? "Unsave" : "Save"}</button>
    </div>
  `).join("");
}

function filterByCategory(cat) {
  document.querySelectorAll('#categories button').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  renderTools(allTools.filter(t => t.category === cat));
}

document.getElementById("searchInput").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  renderTools(allTools.filter(t => t.name.toLowerCase().includes(q) || t.tags.join(" ").toLowerCase().includes(q)));
});

function openTool(url) { window.open(url, "_blank"); }
function copyLink(url) { navigator.clipboard.writeText(url); alert("Copied!"); }

function toggleSave(id) {
  if (savedTools.includes(id)) savedTools = savedTools.filter(x => x !== id);
  else savedTools.push(id);
  localStorage.setItem("savedTools", JSON.stringify(savedTools));
  renderTools(allTools);
  renderSaved();
}

function renderSaved() {
  const grid = document.getElementById("savedTools");
  grid.innerHTML = allTools.filter(t => savedTools.includes(t.id)).map(t => `
    <div class="tool-card">
      <h4>${t.name}</h4>
      <button onclick="openTool('${t.url}')">Open</button>
      <button onclick="toggleSave('${t.id}')">Remove</button>
    </div>
  `).join("") || "<p>No saved tools yet.</p>";
}

document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  document.getElementById("formFeedback").textContent = "Message sent (demo)";
  e.target.reset();
});

document.getElementById("exploreBtn").addEventListener("click", () => {
  document.getElementById("toolsSection").scrollIntoView({ behavior: "smooth" });
});

loadTools();