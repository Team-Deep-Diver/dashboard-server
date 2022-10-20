const express = require("express");
const router = express.Router();

const Card = require("../models/Card");

router.get("/:user_id", async function (req, res, next) {
  // 카드 정보 전달하기 로직 작성
  return res.sendStatus(200);
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

module.exports = router;
