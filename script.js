// Global variables
let sampleData = [];

// Show loading message
document.getElementById("loading").style.display = "block";

// Fetch data from local GitHub repo
fetch("data/gd4_flower_data_slim.json")
  .then(response => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  })
  .then(data => {
    sampleData = data;
    populateSelectors();
    document.getElementById("loading").style.display = "none";
  })
  .catch(error => {
    console.error("Error loading data:", error);
    alert("Failed to load data.");
  });

// Canvas setup
const canvas = document.getElementById("flowerCanvas");
const ctx = canvas.getContext("2d");

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
    anxiety: `rgba(128, 0, 128, ${intensity})`,
    empowerment: `rgba(34, 139, 34, ${intensity})`
  };
  return colors[emotion] || `rgba(200, 200, 200, ${intensity})`;
}

function drawFlower(data) {
  clearCanvas();
  const emotions = Object.entries(data.emotions);
  const numPetals = emotions.length;
  const baseRadius = 70;

  emotions.forEach(([emotion, value], index) => {
    const angle = (index * 2 * Math.PI) / numPetals;
    const color = mapEmotionToColor(emotion, value);
    const radius = baseRadius + value * 50;
    drawPetal(angle, radius, color);
  });
}

function populateSelectors() {
  const countrySelect = document.getElementById("countrySelect");
  const ageSelect = document.getElementById("ageSelect");

  countrySelect.innerHTML = "";
  ageSelect.innerHTML = "";

  const countries = [...new Set(sampleData.map(d => d.country))];
  const ages = [...new Set(sampleData.map(d => d.ageGroup))];

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

  countrySelect.selectedIndex = 0;
  ageSelect.selectedIndex = 0;
  updateFlower();
}

function updateFlower() {
  const country = document.getElementById("countrySelect").value;
  const age = document.getElementById("ageSelect").value;

  const matched = sampleData.find(
    d => d.country === country && d.ageGroup === age
  );

  if (matched) {
    canvas.style.display = "block";
    drawFlower(matched);
  } else {
    clearCanvas();
    canvas.style.display = "none";
    alert("No data available for this combination.");
  }
}

// Initialize
window.onload = () => {
  document.getElementById("countrySelect").addEventListener("change", updateFlower);
  document.getElementById("ageSelect").addEventListener("change", updateFlower);
};
