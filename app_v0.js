let treeData = {};
let historyStack = [];
let currentNode = null;

const sheetURL = "https://opensheet.elk.sh/1FJ7H0NRtWwWcGTzONkNTbKsty5mn3FZCZij-d8zHunI/1";

/* ===============================
   1. DATA LADEN
================================= */

fetch(sheetURL)
  .then(res => res.json())
  .then(data => {

    treeData = convertSheetToTree(data);

    render("s1");

  })
  .catch(err => {

    document.getElementById("app").innerHTML =
      "<p>Fout bij laden van beslisboom data.</p>";

    console.error(err);

  });


/* ===============================
   2. RENDER FUNCTIE
================================= */

function render(nodeId) {
  const node = treeData[nodeId];
  if (!node) return;

  const app = document.getElementById("app");

  // History bijhouden
  if (currentNode !== nodeId) {
    historyStack.push(nodeId);
    currentNode = nodeId;
  }

  let html = "";

  

  // Titel
  if (node.title) {
    html += `<h1>${node.title}</h1>`;
  }

  // Fase
  if (node.phase) {
    html += `<div class="phase">Fase: ${node.phase}</div>`;
  }

  // Tekst
  if (node.text) {
    html += `<p class="text">${node.text}</p>`;
  }

  // Afbeelding
  if (node.image) {
    html += `
      <div class="image-wrapper">
        <img src="${node.image}" alt="">
      </div>
    `;
  }

  // Bullets
  if (node.bullets) {
    html += `<ul class="bullets">`;
    node.bullets.forEach(item => {
      html += `<li>${item}</li>`;
    });
    html += `</ul>`;
  }

  // Buttons
  html += `<div class="buttons">`;

  if (node.options) {
    node.options.forEach(option => {
      html += `
        <button data-next="${option.next}">
          ${option.label}
        </button>
      `;
    });
  }

  // Restart bij eindresultaat
  if (node.result) {
    html += `
      <button class="secondary" data-action="restart">
        Opnieuw starten
      </button>
    `;
  }


  // Terug knop
  if (historyStack.length > 1) {
    html += `
      <button class="secondary" data-action="back">
        Terug
      </button>
    `;
  }

  html += `</div>`;

  app.innerHTML = html;

  attachEvents();
}


/* ===============================
   3. EVENT HANDLERS
================================= */

function attachEvents() {
  const buttons = document.querySelectorAll("button");

  buttons.forEach(btn => {
    // Navigatie
    if (btn.dataset.next) {
      btn.addEventListener("click", () => {
        render(btn.dataset.next);
      });
    }

    // Back
    if (btn.dataset.action === "back") {
      btn.addEventListener("click", back);
    }

    // Restart
    if (btn.dataset.action === "restart") {
      btn.addEventListener("click", restart);
    }
  });
}


/* ===============================
   4. NAVIGATIE FUNCTIES
================================= */

function back() {
  historyStack.pop();              // huidige
  const previous = historyStack.pop();  // vorige
  render(previous);
}

function restart() {
  historyStack = [];
  currentNode = null;
  render("s1");
}

function convertSheetToTree(rows) {

  const tree = {};

  rows.forEach(row => {

    const node = {};

    if (row.phase) node.phase = row.phase;
    if (row.title) node.title = row.title;
    if (row.text) node.text = row.text;
    if (row.image) node.image = row.image;

    if (row.bullets) {
      node.bullets = row.bullets.split("|").map(b => b.trim());
    }

    node.options = [];

    if (row.option1_label) {
      node.options.push({
        label: row.option1_label,
        next: row.option1_next
      });
    }

    if (row.option2_label) {
      node.options.push({
        label: row.option2_label,
        next: row.option2_next
      });
    }

    if (row.option3_label) {
      node.options.push({
        label: row.option3_label,
        next: row.option3_next
      });
    }

    if (row.result === "TRUE" || row.result === "true") {
      node.result = true;
    }

    tree[row.id] = node;

  });

  return tree;

}