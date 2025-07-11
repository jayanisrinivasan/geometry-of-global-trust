let sampleData = [];

// Show loading message
document.getElementById("loading").style.display = "block";

// Fetch mock data
fetch("gdc_flower_mock_data.json")
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

function drawFlower(data, offsetX = 0, offsetY = 0, scale = 1) {
  const emotions = Object.entries(data.emotions);
  const numPetals = emotions.length;
  const baseRadius = 70 * scale;

  emotions.forEach(([emotion, value], index) => {
    const angle = (index * 2 * Math.PI) / numPetals;
    const color = mapEmotionToColor(emotion, value);
    const radius = baseRadius + value * 50 * scale;

    const x = canvas.width / 2 + offsetX;
    const y = canvas.height / 2 + offsetY;
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
}

function getSelectedValues(selectId) {
  const select = document.getElementById(selectId);
  return Array.from(select.selectedOptions).map(opt => opt.value);
}

function updateGarden() {
  clearCanvas();
  const selectedCountries = getSelectedValues("countrySelect");
  const selectedAges = getSelectedValues("ageSelect");

  const matched = sampleData.filter(d =>
    selectedCountries.includes(d.country) && selectedAges.includes(d.ageGroup)
  );

  if (matched.length === 0) {
    alert("No matching data found.");
    return;
  }

  const radius = 130;
  matched.forEach((entry, i) => {
    const angle = (2 * Math.PI * i) / matched.length;
    const xOffset = radius * Math.cos(angle);
    const yOffset = radius * Math.sin(angle);
    drawFlower(entry, xOffset, yOffset, 0.6);
  });

  canvas.style.display = "block";
}

function addUserData(event) {
  event.preventDefault();

  const country = document.getElementById("userCountry").value.trim();
  const ageGroup = document.getElementById("userAge").value.trim();
  const hope = parseFloat(document.getElementById("userHope").value) || 0;
  const fear = parseFloat(document.getElementById("userFear").value) || 0;
  const curiosity = parseFloat(document.getElementById("userCuriosity").value) || 0;
  const anxiety = parseFloat(document.getElementById("userAnxiety").value) || 0;
  const empowerment = parseFloat(document.getElementById("userEmpowerment").value) || 0;

  if (!country || !ageGroup) {
    alert("Country and age group are required.");
    return;
  }

  const newEntry = {
    country,
    ageGroup,
    emotions: {
      hope,
      fear,
      curiosity,
      anxiety,
      empowerment
    }
  };

  sampleData.push(newEntry);
  populateSelectors();
  alert("Your data was added to the garden!");
}

window.onload = () => {
  document.getElementById("countrySelect").addEventListener("change", updateGarden);
  document.getElementById("ageSelect").addEventListener("change", updateGarden);
  document.getElementById("userForm").addEventListener("submit", addUserData);
};
