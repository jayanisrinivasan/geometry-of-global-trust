let sampleData = [];
const canvas = document.getElementById("flowerCanvas");
const ctx = canvas.getContext("2d");

// Show loading
document.getElementById("loading").style.display = "block";

// Load initial data
fetch("gdc_flower_mock_data.json")
  .then((res) => res.json())
  .then((data) => {
    sampleData = data;
    populateSelectors();
    updateFlower();
    document.getElementById("loading").style.display = "none";
  })
  .catch((err) => {
    console.error("Failed to load:", err);
    alert("Could not load flower data.");
  });

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPetal(angle, radius, color) {
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  const control = radius * 0.5;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(control, -radius / 2, 0, -radius);
  ctx.quadraticCurveTo(-control, -radius / 2, 0, 0);
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

  const countries = [...new Set(sampleData.map((d) => d.country))].sort();
  const ageGroups = [...new Set(sampleData.map((d) => d.ageGroup))].sort();

  countrySelect.innerHTML = "";
  ageSelect.innerHTML = "";

  countries.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    countrySelect.appendChild(opt);
  });

  ageGroups.forEach((a) => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    ageSelect.appendChild(opt);
  });

  countrySelect.selectedIndex = 0;
  ageSelect.selectedIndex = 0;
}

function updateFlower() {
  const country = document.getElementById("countrySelect").value;
  const ageGroup = document.getElementById("ageSelect").value;

  const found = sampleData.find(
    (d) => d.country === country && d.ageGroup === ageGroup
  );

  if (found) {
    canvas.style.display = "block";
    drawFlower(found);
  } else {
    clearCanvas();
    canvas.style.display = "none";
    alert("No flower data for this group.");
  }
}

function addNewFlower() {
  const newCountry = document.getElementById("newCountry").value.trim();
  const newAge = document.getElementById("newAge").value.trim();

  const hope = parseFloat(document.getElementById("hope").value);
  const fear = parseFloat(document.getElementById("fear").value);
  const curiosity = parseFloat(document.getElementById("curiosity").value);
  const anxiety = parseFloat(document.getElementById("anxiety").value);
  const empowerment = parseFloat(document.getElementById("empowerment").value);

  if (!newCountry || !newAge) {
    alert("Please enter both country and age group.");
    return;
  }

  const valid = [hope, fear, curiosity, anxiety, empowerment].every(
    (v) => !isNaN(v) && v >= 0 && v <= 1
  );

  if (!valid) {
    alert("All emotions must be numbers between 0 and 1.");
    return;
  }

  const newEntry = {
    country: newCountry,
    ageGroup: newAge,
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

  document.getElementById("countrySelect").value = newCountry;
  document.getElementById("ageSelect").value = newAge;
  updateFlower();

  // Reset inputs
  document.getElementById("newCountry").value = "";
  document.getElementById("newAge").value = "";
  document.getElementById("hope").value = "";
  document.getElementById("fear").value = "";
  document.getElementById("curiosity").value = "";
  document.getElementById("anxiety").value = "";
  document.getElementById("empowerment").value = "";
}
