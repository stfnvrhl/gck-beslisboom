let treeData = {};
let historyStack = [];
let currentNode = null;

/* ===============================
   GOOGLE SHEETS ENDPOINTS
================================= */
//past google sheet ID hieronder:
const sheetID = "1FJ7H0NRtWwWcGTzONkNTbKsty5mn3FZCZij-d8zHunI";

const nodesURL =
  `https://opensheet.elk.sh/${sheetID}/Nodes`;

const optionsURL =
  `https://opensheet.elk.sh/${sheetID}/Options`;

const settingsURL =
  `https://opensheet.elk.sh/${sheetID}/Settings`;


/* ===============================
   DATA LADEN
================================= */

Promise.all([
  fetch(nodesURL).then(res => res.json()),
  fetch(optionsURL).then(res => res.json()),
  fetch(settingsURL).then(res => res.json())
])
.then(([nodes, options, settings]) => {

  treeData = buildTree(nodes, options);
 // console.log("Nodes loaded:", nodes.length);
//console.log("Options loaded:", options.length);
//console.log("Tree:", treeData);
//console.log("Start node:", startNode);

  validateTree(treeData);

  const startNode = getSetting(settings, "start_node") || "s1";

  render(startNode);

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
  if (!node) {
    console.error("Node niet gevonden:", nodeId);
    return;
  }
  
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

   // reset scroll position
  window.scrollTo(0, 0);
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

// build Tree from Nodes and Options
function buildTree(nodes, options) {

  const tree = {};

  /* nodes verwerken */

  nodes.forEach(row => {

    tree[row.id] = {

      phase: row.phase || "",
      title: row.title || "",
      text: row.text || "",
      image: row.image || "",
      options: []

    };

    if (row.bullets) {
      tree[row.id].bullets =
        row.bullets.split("|").map(b => b.trim());
    }

    if (row.result === "TRUE" || row.result === "true") {
      tree[row.id].result = true;
    }

  });

  /* options koppelen */

  options.forEach(row => {

    if (!tree[row.node_id]) return;

    tree[row.node_id].options.push({
      label: row.label,
      next: row.next,
      order: parseInt(row.order) || 0
    });

  });

  /* opties sorteren */

  Object.values(tree).forEach(node => {
    node.options.sort((a,b)=>a.order-b.order);
  });

  return tree;
}

// get Settings
function getSetting(settings, key) {

  const row = settings.find(r => r.key === key);

  return row ? row.value : null;

}

// Optionele validatiefunctie om te controleren of alle verwijzingen kloppen
function validateTree(tree) {

  const ids = Object.keys(tree);

  const referenced = new Set();

  ids.forEach(id => {

    const node = tree[id];

    node.options.forEach(opt => {

      referenced.add(opt.next);

      if (!tree[opt.next]) {

        console.warn(
          "⚠ Node", id,
          "verwijst naar niet bestaande node",
          opt.next
        );

      }

    });

  });

  ids.forEach(id => {

    if (id !== "s1" && !referenced.has(id)) {

      console.warn(
        "⚠ Node", id,
        "wordt nooit bereikt"
      );

    }

  });

  console.log("✔ Nodes geladen:", ids.length);

}

// PARALLAX BACKGROUND

window.addEventListener("scroll", () => {
  requestAnimationFrame(() => {
    const scrollY = window.scrollY;

    document.body.style.backgroundPositionY =
      `${scrollY * 0.2}px`;
  });
});