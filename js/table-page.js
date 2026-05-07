const groups = {};
data.forEach(item => {
  (groups[item.group] ||= []).push(item);
});

document.getElementById("table-page").innerHTML = Object.entries(groups).map(([name, items]) => `
  <div class="group">
    <div class="group-title">${name}</div>
    <div class="grid">
      ${items.map(i => `
        <div class="cell">
          <div class="char">${i.char}</div>
          <div class="name">${i.displayName}</div>
        </div>
      `).join("")}
    </div>
  </div>
`).join("");