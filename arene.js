const arena = document.getElementById('arena');
const pokemons = [];
const TOTAL_POKEMON = 10;

function loadPokemons() {
  fetch('arene.json')
    .then(res => res.json())
    .then(data => {
      for (let i = 0; i < TOTAL_POKEMON; i++) {
        const randomData = data[Math.floor(Math.random() * data.length)];
        createPokemon({ ...randomData });
      }
      requestAnimationFrame(gameLoop);
    });
}

function createPokemon(data) {
  const el = document.createElement('div');
  el.classList.add('pokemon');
  el.style.backgroundImage = `url('${data.sprite}')`;

  const startX = Math.random() * (arena.clientWidth - 48);
  const startY = Math.random() * (arena.clientHeight - 48);
  el.style.left = `${startX}px`;
  el.style.top = `${startY}px`;

  arena.appendChild(el);

  const pokemon = {
    ...data,
    x: startX,
    y: startY,
    el
  };

  pokemons.push(pokemon);
}

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function typeAdvantage(attacker, target) {
  const rules = {
    feu: "plante",
    plante: "eau",
    eau: "feu"
  };
  return rules[attacker.type] === target.type;
}

function updatePositions() {
  pokemons.forEach(p => {
    let target = null;
    let minDist = Infinity;
    for (let other of pokemons) {
      if (other !== p && typeAdvantage(p, other)) {
        const d = distance(p, other);
        if (d < minDist) {
          minDist = d;
          target = other;
        }
      }
    }

    if (target) {
      const dx = target.x - p.x;
      const dy = target.y - p.y;
      const dist = Math.sqrt(dx ** 2 + dy ** 2);
      if (dist > 1) {
        p.x += (dx / dist) * p.speed;
        p.y += (dy / dist) * p.speed;
        p.el.style.left = `${p.x}px`;
        p.el.style.top = `${p.y}px`;
      }
    }
  });
}

function updateBehaviors() {
  for (let i = 0; i < pokemons.length; i++) {
    for (let j = i + 1; j < pokemons.length; j++) {
      const p1 = pokemons[i];
      const p2 = pokemons[j];
      const d = distance(p1, p2);
      if (d < 40) {
        if (typeAdvantage(p1, p2)) {
          arena.removeChild(p2.el);
          pokemons.splice(j, 1);
          return;
        } else if (typeAdvantage(p2, p1)) {
          arena.removeChild(p1.el);
          pokemons.splice(i, 1);
          return;
        }
      }
    }
  }
}

function gameLoop() {
  updatePositions();
  updateBehaviors();
  requestAnimationFrame(gameLoop);
}

loadPokemons();
