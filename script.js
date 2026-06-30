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
  return color;
};

const generateRandomColorHSL = () => {
  const H = Math.floor(Math.random() * 360);
  const S = Math.floor(Math.random() * (100 - 60 + 1)) + 60; //Le doy este rango para que salgan colores lindos
  const L = Math.floor(Math.random() * (70 - 35 + 1)) + 35; // sino salen colores o muy claros o muy obscuros
  const color = `hsl(${H}, ${S}%, ${L}%)`;
  return color;
};

////codigo nuevo refactorizado , lo dividi en funcionalidades por que hacia muchas cosas.
const createColorBox = (color, index) => {
  const colorDiv = document.createElement("div");
  const colorSpan = document.createElement("span");
  const buttonsContainer = document.createElement("div");
  colorSpan.id = `color-${index}`;
  colorDiv.id = `box-${index}`;
  colorSpan.textContent = color;
  colorSpan.classList.add("colorSpan");
  buttonsContainer.classList.add("buttons-container");
  buttonsContainer.innerHTML = `
        <button class="save-btn" id="save-btn-${index}">
          <i class="fa-regular fa-heart"></i>
        </button>

        <button class="copy-btn" id="copy-btn-${index}">
          <i class="fa-regular fa-copy"></i>
        </button>
      `;
  colorDiv.classList.add("color-box");
  colorDiv.style.backgroundColor = color;
  colorDiv.appendChild(colorSpan);
  colorDiv.appendChild(buttonsContainer);
  return colorDiv;
};

const addColorBoxEvents = (index, color) => {
  const colorButtonSave = document.getElementById(`save-btn-${index}`);
  const colorButtonCopy = document.getElementById(`copy-btn-${index}`);
  colorButtonCopy.addEventListener("click", function (event) {
    navigator.clipboard.writeText(color);
    showTooltipCopy(event);
  });
  colorButtonSave.addEventListener("click", function (event) {
    currentColors[index].isSaved = !currentColors[index].isSaved;
    const icon = colorButtonSave.querySelector("i");

    if (currentColors[index].isSaved) {
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
    } else {
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
    }
    showTooltipSave(event, currentColors[index].isSaved);
  });
};

const generateColorBoxes = () => {
  const selectedRadioButton = document.querySelector(
    'input[name="size"]:checked',
  );
  container.innerHTML = "";
  const selectedSize = selectedRadioButton.value;
  let generateRandomColor;

  if (selectedFormat.value === "hex") {
    generateRandomColor = generateRandomColorHex;
  }
  if (selectedFormat.value === "hsl") {
    generateRandomColor = generateRandomColorHSL;
  }

  for (let i = 0; i < selectedSize; i++) {
    const color = currentColors[i].color;
    const colorDiv = createColorBox(color, i);
    container.appendChild(colorDiv);
    addColorBoxEvents(i, color);
    const icon = document.getElementById(`save-btn-${i}`).querySelector("i"); //para que el corazon no cambie si esta guardado
    if (currentColors[i].isSaved) {
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
    }
  }
};
////codigo nuevo refactorizado

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

//aca empiezo con mi funcion de refreshPalette para volver a generar colores si algunos estan bloqueados o no

const refreshPalette = (array) => {
  for (let i = 0; i < array.length; i++) {
    colorBox = document.getElementById(`box-${i}`);
    if (!array[i].isSaved) {
      if (currentColors[i].color.startsWith("#")) {
        const newColor = generateRandomColorHex();
        colorBox.style.backgroundColor = newColor;
        currentColors[i].color = newColor;
      }
      if (currentColors[i].color.startsWith("hsl")) {
        const newColor = generateRandomColorHSL();
        colorBox.style.backgroundColor = newColor;
        currentColors[i].color = newColor;
      }
    }
  }
};

const updatePaletteSize = (selectedSize) => {
  while (currentColors.length < selectedSize) {
    let color;
    if (selectedFormat.value === "hex") {
      color = generateRandomColorHex();
    } else {
      color = generateRandomColorHSL();
    }
    currentColors.push({
      color: color,
      isSaved: false,
    });
  }
  if (currentColors.length > selectedSize) {
    for (let i = selectedSize; i < currentColors.length; i++) {
      if (currentColors[i].isSaved) {
        alert(
          "🚨 You can't reduce the palette because there are locked colors that would disappear 🚨",
        );
        document.querySelector(
          `input[name="size"][value="${currentColors.length}"]`,
        ).checked = true;
        return false;
      }
    }
    currentColors.length = selectedSize;
  }
  return true;
};

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
    separateLight = separateLight[2].replace("%)", "");
    separateLight = Number(separateLight);
    return separateLight;
  }
};

const calculateSaturation = (array) => {
  for (let i = 0; i < array.length; i++) {
    const colorSpan = document.getElementById(`color-${i}`);
    const colorButtonSave = document.getElementById(`save-btn-${i}`);
    const colorButtonCopy = document.getElementById(`copy-btn-${i}`);
    const lightness = getLightness(array[i].color);
    if (lightness <= 55) {
      colorSpan.style.color = "white";
      colorButtonCopy.style.color = "white";
      colorButtonSave.style.color = "white";
    }
    if (lightness >= 55) {
      colorSpan.style.color = "black";
      colorButtonSave.style.color = "black";
      colorButtonCopy.style.color = "black";
    }
  }
};

const radioButtons = document.querySelectorAll('input[name="size"]');
radioButtons.forEach((radiobutton) => {
  radiobutton.addEventListener("click", function () {
    const selectedRadioButton = document.querySelector(
      'input[name="size"]:checked',
    );
    const selectedSize = Number(selectedRadioButton.value);
    const updated = updatePaletteSize(selectedSize);
    if (updated) {
      generateColorBoxes();
      calculateSaturation(currentColors);
    }
  });
});

generateButton.addEventListener("click", function () {
  refreshPalette(currentColors);
  calculateSaturation(currentColors);
});

selectedFormat.addEventListener("change", function () {
  for (let i = 0; i < currentColors.length; i++) {
    const color = convertColor(currentColors[i].color);
    const colorSpan = document.getElementById(`color-${i}`);
    colorSpan.textContent = color;
    currentColors[i].color = convertColor(currentColors[i].color); //aca reemplazo el valor anterior de mi array por el nuevo modificado.
  }
});

miSelect.addEventListener("change", function () {
  if (miSelect.value === "white") {
    navbar.style.borderBottom = "15px solid white";
    interactionContainer.style.borderTop = "15px solid white";
  }
  if (miSelect.value === "black") {
    navbar.style.borderBottom = "15px solid black";
    interactionContainer.style.borderTop = "15px solid black";
  }
});

//funcion para evento click de tipo tooltip para boton copiar, uso la misma logica para mi boton guardar
//  , ver como hacerla dinamica para acortar codigo despues.
const showTooltipCopy = (event) => {
  console.log("entré al tooltip");
  const tooltip = document.createElement("div");
  tooltip.textContent = "✓ Copied";
  tooltip.classList.add("tooltip");
  tooltip.style.left = `${event.clientX}px`;
  tooltip.style.top = `${event.clientY - 40}px`;
  document.body.appendChild(tooltip);
  console.log(tooltip);

  setTimeout(() => {
    tooltip.remove();
  }, 1000);
};

const showTooltipSave = (event, isSaved) => {
  const tooltip = document.createElement("div");
  if (isSaved) {
    console.log("entre al if unsaved");
    tooltip.textContent = "Color saved";
    tooltip.classList.add("tooltip");
    tooltip.style.left = `${event.clientX}px`;
    tooltip.style.top = `${event.clientY - 40}px`;
    document.body.appendChild(tooltip);

    setTimeout(() => {
      tooltip.remove();
    }, 1000);
  } else tooltip.textContent = "Color unsaved";
  tooltip.classList.add("tooltip");
  tooltip.style.left = `${event.clientX}px`;
  tooltip.style.top = `${event.clientY - 40}px`;
  document.body.appendChild(tooltip);

  setTimeout(() => {
    tooltip.remove();
  }, 1000);
};

updatePaletteSize(6);
generateColorBoxes();
calculateSaturation(currentColors);
console.log(currentColors);
