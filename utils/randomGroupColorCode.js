function randomGroupColorCode() {
  const colorCodes = [
    "#9BC7EC",
    "#AFD6F8",
    "#B5E4F6",
    "#CEEDED",
    "#D1DDF8",
    "#A3BDED",
    "#B5E4F6",
    "#7FC6D7",
    "#CEEAF6",
    "#DBDAE3",
  ];
  const randomIndex = Math.floor(Math.random() * 10);

  return colorCodes[randomIndex];
}

module.exports = randomGroupColorCode;
