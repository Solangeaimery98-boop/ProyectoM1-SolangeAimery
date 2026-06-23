const container = document.getElementById("paletteContainer");
const hexCharacters = "0123456789ABCDEF";
const generateButton = document.getElementById("generateButton");
const miSelect = document.getElementById("backgroundColor");
const navbar = document.getElementById("navbar");
const interactionContainer = document.getElementById("interactionContainer");
const selectedFormat = document.getElementById("format");

const radioButtons = document.querySelectorAll('input[name="size"]');
radioButtons.forEach((radiobutton) => {
  radiobutton.addEventListener("click", function () {
    generateColorBoxes();
  });
});

const generateRandomColorHex = () => {
  let color = "#";
  for (let i = 0; i < 6; i++) {
    const randomCharacter = Math.floor(Math.random() * 16);
    color = color + hexCharacters[randomCharacter];
  }
  console.log(color); //me da bien el color sii
  return color;
};

const generateRandomColorHSL = () => {
  const H = Math.floor(Math.random() * 360);
  const S = Math.floor(Math.random() * (100 - 60 + 1)) + 60; //Le doy este rango para que salgan colores lindos
  const L = Math.floor(Math.random() * (70 - 35 + 1)) + 35; // sino salen colores o muy claros o muy obscuros
  const color = `hsl(${H}, ${S}%, ${L}%)`;
  console.log(color); //funciona
  return color;
};

generateRandomColorHSL();

const generateColorBoxes = () => {
  const selectedRadioButton = document.querySelector(
    'input[name="size"]:checked',
  );
  container.innerHTML = "";
  const selectedSize = selectedRadioButton.value;
  if (selectedFormat.value === "hex") {
    for (let i = 0; i < selectedSize; i++) {
      const colorDiv = document.createElement("div");
      const color = generateRandomColorHex();
      colorDiv.classList.add("color-box");
      colorDiv.style.backgroundColor = color;
      container.appendChild(colorDiv);
    }
  }
  if (selectedFormat.value === "hsl") {
    console.log("entre al if de hsl");
    for (let i = 0; i < selectedSize; i++) {
      const colorDiv = document.createElement("div");
      const color = generateRandomColorHSL();
      colorDiv.classList.add("color-box");
      colorDiv.style.backgroundColor = color;
      container.appendChild(colorDiv);
    }
  }
};

generateButton.addEventListener("click", function () {
  generateColorBoxes();
});

selectedFormat.addEventListener("change", function () {
  generateColorBoxes();
});

miSelect.addEventListener("change", function () {
  if (miSelect.value === "white") {
    navbar.style.backgroundColor = "white";
    interactionContainer.style.backgroundColor = "white";
  }
  if (miSelect.value === "black") {
    navbar.style.backgroundColor = "black";
    interactionContainer.style.backgroundColor = "black";
  }
}); // aun tenemos que ajustar estilos para letras etc. pero al menos tenemos la funcionalidad basica.

generateColorBoxes();
