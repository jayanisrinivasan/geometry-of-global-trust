// Global data array
let flowerData = [];

// Canvas setup
const canvas = document.getElementById("flowerCanvas");
const ctx = canvas.getContext("2d");

// Load data
document.getElementById("loading").style.display = "block";
fetch("gdc_flower_mock_data.json")
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch data.");
    return res.json();
  })
  .then(data => {
    flowerData = data;
    populateSelectors();
    document.getElementById("loading").style.display = "none";
  })
  .catch(err => {
    console.error(err);
    alert("Failed to load data.");
  });

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPetal(angle, radius, color) {
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  const controlRadius = radius * 0.5;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(controlRadius, -radius / 2, 0, -radius);
  ctx.quadraticCurveTo(-controlRadius, -radius / 2, 0, 0);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function mapEmotionToColor(emotion, intensity) {
  const colors = {
    hope: `rgba(255, 215, 0, ${intensity})`,
    fear: `rgba(255, 0, 0, ${intensity})`,
    curiosity: `rgba(0, 191, 255, ${intensity})`,
    anxiety: `rgba(138, 43, 226, ${intensity})`,
    empowerment: `rgba(34, 139, 34, ${intensity})`
  };
  return colors[emotion] || `rgba(200, 200, 200, ${intensity})`;
}

function drawFlower(data) {
  clearCanvas();
  const emotions = Object.entries(data.emotions);
  const numPetals = emotions.length;
  const baseRadius = 70;

  emotions.forEach(([emotion, value], i) => {
    const angle = (i * 2 * Math.PI) / numPetals;
    const color = mapEmotionToColor(emotion, value);
    const radius = baseRadius + value * 50;
    drawPetal(angle, radius, color);
  });
}

function populateSelectors() {
  const countrySelect = document.getElementById("countrySelect");
  const ageSelect = document.getElementById("ageSelect");

  countrySelect.innerHTML = '<option disabled selected>-- Select Country --</option>';
  ageSelect.innerHTML = '<option disabled selected>-- Select Age Group --</option>';

  const countries = [...new Set(flowerData.map(d => d.country))].sort();
  const ages = [...new Set(flowerData.map(d => d.ageGroup))].sort();

  countries.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.innerText = c;
    countrySelect.appendChild(opt);
  });

  ages.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.innerText = a;
    ageSelect.appendChild(opt);
  });
}

function updateFlower() {
  const country = document.getElementById("countrySelect").value;
  const age = document.getElementById("ageSelect").value;

  const matched = flowerData.find(d => d.country === country && d.ageGroup === age);

  if (matched) {
    canvas.style.display = "block";
    drawFlower(matched);
  } else {
    clearCanvas();
    canvas.style.display = "none";
    alert("No data for this combination. Try planting your own flower below.");
  }
}

function addUserData() {
  const newCountry = document.getElementById("newCountry").value.trim();
  const newAge = document.getElementById("newAge").value.trim();

  const emotions = {
    hope: parseFloat(document.getElementById("hope").value) || 0,
    fear: parseFloat(document.getElementById("fear").value) || 0,
    curiosity: parseFloat(document.getElementById("curiosity").value) || 0,
    anxiety: parseFloat(document.getElementById("anxiety").value) || 0,
    empowerment: parseFloat(document.getElementById("empowerment").value) || 0
  };

  if (!newCountry || !newAge) {
    alert("Please enter both country and age group.");
    return;
  }

  const entry = { country: newCountry, ageGroup: newAge, emotions };
  flowerData.push(entry);

  // Update dropdowns with new values if not already present
  const countrySelect = document.getElementById("countrySelect");
  if (![...countrySelect.options].some(opt => opt.value === newCountry)) {
    const newOpt = document.createElement("option");
    newOpt.value = newCountry;
    newOpt.innerText = newCountry;
    countrySelect.appendChild(newOpt);
  }

  const ageSelect = document.getElementById("ageSelect");
  if (![...ageSelect.options].some(opt => opt.value === newAge)) {
    const newOpt = document.createElement("option");
    newOpt.value = newAge;
    newOpt.innerText = newAge;
    ageSelect.appendChild(newOpt);
  }

  alert("Flower added to the garden! Select it from above to view.");
}

window.onload = () => {
  document.getElementById("countrySelect").addEventListener("change", updateFlower);
  document.getElementById("ageSelect").addEventListener("change", updateFlower);
};
