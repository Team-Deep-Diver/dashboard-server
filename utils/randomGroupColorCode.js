function randomGroupColorCode() {
  const colorCodes = [
    "#F5DF4D",
    "#FF6F61",
    "#5F4BBB",
    "#009473",
    "#7BC4C4",
    "#0F4C81",
    "#88BO4B",
    "#F7CACA",
    "#93A9D1",
  ];
  const randomIndex = Math.floor(Math.random() * 10);

  return colorCodes[randomIndex];
}

module.exports = randomGroupColorCode;
