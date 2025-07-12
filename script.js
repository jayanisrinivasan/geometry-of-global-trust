// Load mock data
let flowerData = [];
fetch("data/gdc_flower_mock_data.json")
  .then((response) => response.json())
  .then((data) => {
    flowerData = data;
  });

function drawFlower(emotions) {
  const canvas = document.getElementById("flower-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 400;
  canvas.height = 400;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const colors = {
    hope: "#FFD700",
    fear: "#FF0000",
    curiosity: "#00BFFF",
    anxiety: "#800080",
    empowerment: "#228B22",
  };

  const keys = Object.keys(emotions);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxRadius = 100;

  keys.forEach((key, i) => {
    const angle = (2 * Math.PI * i) / keys.length;
    const radius = emotions[key] * maxRadius;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.quadraticCurveTo(centerX, centerY, x, y);
    ctx.fillStyle = colors[key];
    ctx.globalAlpha = 0.8;
    ctx.arc(centerX, centerY, radius, angle, angle + 0.8, false);
    ctx.fill();
  });

  ctx.globalAlpha = 1.0;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
  ctx.fillStyle = "#333";
  ctx.fill();
}

function onGenerateClick() {
  const country = document.getElementById("country-input").value;
  const ageGroup = document.getElementById("age-input").value;
  const match = flowerData.find(
    (entry) => entry.country === country && entry.ageGroup === ageGroup
  );

  if (match) {
    drawFlower(match.emotions);
  } else {
    alert("No data found for that country and age group.");
  }
}

document
  .getElementById("generate-btn")
  .addEventListener("click", onGenerateClick);

document
  .getElementById("plant-btn")
  .addEventListener("click", () => {
    const country = document.getElementById("custom-country").value;
    const ageGroup = document.getElementById("custom-age").value;
    const hope = parseFloat(document.getElementById("hope").value) || 0;
    const fear = parseFloat(document.getElementById("fear").value) || 0;
    const curiosity = parseFloat(document.getElementById("curiosity").value) || 0;
    const anxiety = parseFloat(document.getElementById("anxiety").value) || 0;
    const empowerment =
      parseFloat(document.getElementById("empowerment").value) || 0;

    const newFlower = {
      country,
      ageGroup,
      emotions: {
        hope,
        fear,
        curiosity,
        anxiety,
        empowerment,
      },
    };

    flowerData.push(newFlower);
    alert("Your trust flower has been planted in the garden!");
  });
