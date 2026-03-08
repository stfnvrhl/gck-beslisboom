let treeData = {};
let historyStack = [];
let currentNode = null;


/* ===============================
   1. DATA LADEN
================================= */

fetch("data.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Kan data.json niet laden");
    }
    return response.json();
  })
  .then(data => {
    treeData = data;
    render("s1");   // startpunt
  })
  .catch(error => {
    document.getElementById("app").innerHTML =
      "<p>Fout bij laden van de beslisboom.</p>";
    console.error(error);
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