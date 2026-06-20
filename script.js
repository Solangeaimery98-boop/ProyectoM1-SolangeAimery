const contenedor = document.getElementById("paletteContainer");

const generateColorBoxes = () => {
  const selectedRadioButton = document.querySelector(
    'input[name="size"]:checked',
  );
  const selectedSize = selectedRadioButton.value;
  for (let i = 0; i < selectedSize; i++) {
    const colorDiv = document.createElement("div");
    colorDiv.classList.add("color-box");
    contenedor.appendChild(colorDiv);
  }
};

generateColorBoxes();
