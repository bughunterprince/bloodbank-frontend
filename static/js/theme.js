// Moved from root theme.js
document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.createElement("button");
  toggleButton.id = "themeToggle";
  toggleButton.innerText = "🌙";
  document.body.appendChild(toggleButton);
  Object.assign(toggleButton.style, { position:"fixed", top:"20px", right:"20px", zIndex:"1000", padding:"8px 12px", border:"none", borderRadius:"8px", background:"#d32f2f", color:"white", fontSize:"18px", cursor:"pointer", boxShadow:"0px 4px 6px rgba(0,0,0,0.2)" });
  if (localStorage.getItem("theme") === "dark") { document.body.classList.add("dark-mode"); toggleButton.innerText = "☀️"; }
  toggleButton.addEventListener("click", () => { document.body.classList.toggle("dark-mode"); if (document.body.classList.contains("dark-mode")) { localStorage.setItem("theme","dark"); toggleButton.innerText = "☀️"; } else { localStorage.setItem("theme","light"); toggleButton.innerText = "🌙"; } });
});
