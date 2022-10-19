const express = require("express");
const router = express.Router();
const jwtVerify = require("../configs/jwt");

const Card = require("../models/Card");
const User = require("../models/User");
const Group = require("../models/Group");

router.get("/", async function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/:user_id/cards", async function (req, res, next) {
  const userId = req.params["user_id"];

  const temp = new Date("2022-10-16T14:32:12.359+00:00"); // fake data: client로 받은 date 객체라고 가정

  const userCards = await Card.find({
    createdBy: userId,
  });

  const filteredCards = userCards.filter((card) => {
    return (
      card.period.startDate.getMilliseconds() <= temp.getMilliseconds() &&
      card.period.endDate.getMilliseconds() >= temp.getMilliseconds()
    );
  });

  const snapshots = filteredCards.reduce((acc, cur) => {
    const currentSnapshot = cur.snapshots.filter((snapshot) => {
      return snapshot.createdAt.getDate() === new Date(temp).getDate();
    });

    return acc.concat(currentSnapshot);
  }, []);

  res.send(snapshots);
});

router.post("/:user_id/cards", async function (req, res, next) {
  const userId = req.params["user_id"];
  const start = new Date("2022-10-16T14:32:12.359+00:00");
  const end = new Date("2022-10-18T14:32:12.359+00:00");

  const newCard = new Card({
    createdBy: userId,
    colorCode: "#CDDAFD",
    period: {
      startDate: start,
      endDate: end,
    },
  });

  newCard.snapshots = [
    {
      createdAt: start,
      category: "study",
      value: {
        todos: [
          {
            text: "framer",
            checked: false,
          },
        ],
      },
      coordinate: {
        x: 10,
        y: 10,
      },
    },
    {
      createdAt: new Date("2022-10-17T14:32:12.359+00:00"),
      category: "study",
      value: {
        todos: [
          {
            text: "framer",
            checked: false,
          },
        ],
      },
      coordinate: {
        x: 10,
        y: 10,
      },
    },
    {
      createdAt: end,
      category: "study",
      value: {
        todos: [
          {
            text: "framer",
            checked: false,
          },
        ],
      },
      coordinate: {
        x: 10,
        y: 10,
      },
    },
  ];

  await newCard.save();
});

router.get(
  "/:user_id/groups",
  jwtVerify.confirmToken,
  jwtVerify.verifyToken,
  async function (req, res, next) {
    try {
      const user = await User.findOne({ _id: req.body._id });

      if (user.role === "ADMIN") {
        const group = await Group.findOne({ admin: user._id });

        if (group) {
          return res.json(group);
        }

        return res.json([]);
      } else if (user.role === "MEMBER") {
        res.json(user.groups);
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
