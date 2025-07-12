let flowerData = {};
let canvas = document.getElementById("flower-canvas");
let ctx = canvas.getContext("2d");

async function loadData() {
  const response = await fetch("gdc_flower_mock_data.json");
  flowerData = await response.json();
  const countrySelect = document.getElementById("country-select");
  const ageSelect = document.getElementById("age-select");

  const countries = new Set();
  const ages = new Set();
  for (let key in flowerData) {
    const [country, age] = key.split("-");
    countries.add(country);
    ages.add(age);
  }

  countries.forEach(country => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });

  ages.forEach(age => {
    const option = document.createElement("option");
    option.value = age;
    option.textContent = age;
    ageSelect.appendChild(option);
  });
}

function drawPetal(angle, length, color) {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const x = cx + Math.cos(angle) * length;
  const y = cy + Math.sin(angle) * length;

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.quadraticCurveTo((cx + x) / 2, (cy + y) / 2 - 40, x, y);
  ctx.quadraticCurveTo((cx + x) / 2, (cy + y) / 2 + 40, cx, cy);
  ctx.fillStyle = color;
  ctx.fill();
}

function renderFlower(data) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const emotions = [
    { key: "hope", color: "#FFD700" },
    { key: "fear", color: "#FF0000" },
    { key: "curiosity", color: "#00BFFF" },
    { key: "anxiety", color: "#800080" },
    { key: "empowerment", color: "#228B22" },
  ];
  emotions.forEach((e, i) => {
    drawPetal((i * 2 * Math.PI) / 5, 80 + data[e.key] * 120, e.color);
  });
}

document.getElementById("generate-btn").addEventListener("click", () => {
  const country = document.getElementById("country-select")?.value || document.getElementById("country-input")?.value;
  const age = document.getElementById("age-select")?.value || document.getElementById("age-input")?.value;
  const key = `${country}-${age}`;
  if (flowerData[key]) {
    renderFlower(flowerData[key]);
  } else {
    alert("No data available for that selection.");
  }
});

document.getElementById("plant-btn")?.addEventListener("click", () => {
  const customData = {
    hope: parseFloat(document.getElementById("hope").value),
    fear: parseFloat(document.getElementById("fear").value),
    curiosity: parseFloat(document.getElementById("curiosity").value),
    anxiety: parseFloat(document.getElementById("anxiety").value),
    empowerment: parseFloat(document.getElementById("empowerment").value),
  };
  renderFlower(customData);
});
