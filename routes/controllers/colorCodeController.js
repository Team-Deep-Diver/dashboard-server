const Card = require("../../models/Card");

module.exports = {
  getColorCode: function (req, res, next) {
    const colorList = Card.schema.path("colorCode").enumValues;

    return res.status(200).json({ colorList });
  },
};
