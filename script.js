const container = document.getElementById("paletteContainer");
const hexCharacters = "0123456789ABCDEF";
const generateButton = document.getElementById("generateButton");
const miSelect = document.getElementById("backgroundColor");
const navbar = document.getElementById("navbar");
const interactionContainer = document.getElementById("interactionContainer");
const selectedFormat = document.getElementById("format");
let currentColors = [];

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

const generateColorBoxes = () => {
  const selectedRadioButton = document.querySelector(
    'input[name="size"]:checked',
  );
  container.innerHTML = "";
  const selectedSize = selectedRadioButton.value;
  currentColors = [];
  if (selectedFormat.value === "hex") {
    for (let i = 0; i < selectedSize; i++) {
      const colorDiv = document.createElement("div");
      const colorSpan = document.createElement("span");
      const color = generateRandomColorHex();
      colorSpan.id = `color-${i}`;
      colorSpan.textContent = color;
      colorSpan.classList.add("hidden");
      colorDiv.appendChild(colorSpan);
      colorDiv.classList.add("color-box");
      colorDiv.style.backgroundColor = color;
      container.appendChild(colorDiv);
      currentColors.push(color);
    }
  }
  if (selectedFormat.value === "hsl") {
    console.log("entre al if de hsl");
    for (let i = 0; i < selectedSize; i++) {
      const colorDiv = document.createElement("div");
      const colorSpan = document.createElement("span");
      colorDiv.appendChild(colorSpan);
      colorSpan.id = `color-${i}`;
      const color = generateRandomColorHSL();
      colorSpan.textContent = color;
      colorSpan.classList.add("hidden");
      colorDiv.classList.add("color-box");
      colorDiv.style.backgroundColor = color;
      container.appendChild(colorDiv);
      currentColors.push(color);
    }
  }
};

//funcion unica y exclusiva para cuando cambio el select de formato elegido y
//no se modifiquen los colores solo el formato y el span
function hexToHsl(color) {
  if (typeof color === "string" && color.startsWith("#")) {
    let hex = color.slice(1);

    let r = parseInt(hex.slice(0, 2), 16) / 255;
    let g = parseInt(hex.slice(2, 4), 16) / 255;
    let b = parseInt(hex.slice(4, 6), 16) / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s;
    let l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;

      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h *= 60;
    }

    return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }
}

function hslToHex(hsl) {
  const values = hsl.match(/\d+/g);

  let h = Number(values[0]);
  let s = Number(values[1]) / 100;
  let l = Number(values[2]) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return (
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0")
  ).toUpperCase();
}

function convertColor(color) {
  if (color.startsWith("#")) {
    return hexToHsl(color);
  }

  if (color.startsWith("hsl")) {
    return hslToHex(color);
  }
}

//Funciones que calculan la luz de mi color para mostrar el span blanco o negro segun sea necesario para mejo9r contraste
const getLightness = (color) => {
  if (color.startsWith("#")) {
    let separateLight = hexToHsl(color);
    separateLight = separateLight.split(",");
    separateLight = separateLight[2].replace("%)", "");
    separateLight = Number(separateLight);
    return separateLight;
  } else {
    let separateLight = color.split(",");
    separateLight = separateLight[3].replace("%)", "");
    separateLight = Number(separateLight);
    return separateLight;
  }
};

const calculateSaturation = (array) => {
  for (let i = 0; i < array.length; i++) {
    const colorSpan = document.getElementById(`color-${i}`);
    const lightness = getLightness(array[i]);
    if (lightness <= 60) {
      colorSpan.style.color = "white";
    }
    if (lightness >= 60) {
      colorSpan.style.color = "black";
    }
  }
};

const radioButtons = document.querySelectorAll('input[name="size"]');
radioButtons.forEach((radiobutton) => {
  radiobutton.addEventListener("click", function () {
    generateColorBoxes();
  });
});

generateButton.addEventListener("click", function () {
  generateColorBoxes();
});

selectedFormat.addEventListener("change", function () {
  for (let i = 0; i < currentColors.length; i++) {
    const color = convertColor(currentColors[i]);
    const colorSpan = document.getElementById(`color-${i}`);
    colorSpan.textContent = color;
    currentColors[i] = convertColor(currentColors[i]); //aca reemplazo el valor anterior de mi array por el nuevo modificado.
  }
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
calculateSaturation(currentColors);
