const { Server } = require("socket.io");

const Card = require("../models/Card");
const Snapshot = require("../models/Card");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.SOCKET_CLIENT_HOST,
      methods: ["GET", "PUT", "POST", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("searchMyCards", async (data) => {
      const { user_id, currentDate } = data;

      const myCards = await Card.aggregate([
        { $match: { createdBy: user_id } },
        {
          $match: {
            "snapshots.createdAt": new Date(currentDate).toLocaleDateString(),
          },
        },
      ]);

      if (myCards.length > 0) {
        return socket.emit("getMyCards", myCards);
      }

      // console.log("실행되고있음?");
      // const finded = await Card.findOne(
      //   {
      //     createdBy: user_id,
      //     "period.startDate": { $lte: new Date(currentDate) },
      //     "period.endDate": { $gte: new Date(currentDate) },
      //   },
      //   {
      //     $push: {
      //       snapshots: {
      //         createdAt: currentDate,
      //         category: "hey",
      //         value: {
      //           todos: [],
      //           imgUrl: "",
      //           description: "aaaaa",
      //         },
      //         coordinate: { x: 0, y: 0 },
      //       },
      //     },
      //   }
      // );

      // 소켓 연결 잘되어 있는지?
      //
      // const finded = await Card.findOneAndUpdate(
      //   {
      //     createdBy: user_id,
      //     "period.startDate": { $lte: new Date(currentDate) },
      //     "period.endDate": { $gte: new Date(currentDate) },
      //   },
      //   {
      //     $push: {
      //       snapshots: {
      //         createdAt: currentDate,
      //         category: "hey",
      //         value: {
      //           todos: [],
      //           imgUrl: "",
      //           description: "aaaaa",
      //         },
      //         coordinate: { x: 0, y: 0 },
      //       },
      //     },
      //   }
      // );

      // console.log("find!!", finded);
      // console.log("실행되고있음?2");

      // 첫번째 시도
      // Card.find(
      //   {
      //     createdBy: user_id,
      //     "period.startDate": { $lte: new Date(currentDate) },
      //     "period.endDate": { $gte: new Date(currentDate) },
      //   },
      //   (err, card) => {
      //     const snapshotArr = card.snapshots;

      //     if (snapshotArr.length > 0)
      //     for (let i = snapshotArr.length - 1; i >= 0; i--) {
      //       if (new Date(snapshotArr[i].createdAt) < new Date(currentDate)) {
      //         lastVisitedSnapshot = snapshotArr[i];

      //         snapshotArr.push({
      //           createdAt: new Date(currentDate).toLocaleDateString(),
      //           category: lastVisitedSnapshot.category,
      //           value: lastVisitedSnapshot.value,
      //           coordinate: lastVisitedSnapshot.coordinate,
      //         });
      //         break;
      //       }
      //     }

      //     card.save();
      //   }
      // );

      // await Card.save();

      // 2번째 시도
      // const periodMatchCards = await Card.find({
      //   createdBy: user_id,
      //   "period.startDate": { $lte: new Date(currentDate) },
      //   "period.endDate": { $gte: new Date(currentDate) },
      // });

      // let lastVisitedSnapshot = null;

      // if (periodMatchCards.length > 0) {
      //   periodMatchCards.forEach((card) => {
      //     const snapshotArr = card.snapshots;

      //     for (let i = snapshotArr.length - 1; i >= 0; i--) {
      //       if (new Date(snapshotArr[i].createdAt) < new Date(currentDate)) {
      //         lastVisitedSnapshot = snapshotArr[i];

      //         snapshotArr.push({
      //           createdAt: new Date(currentDate).toLocaleDateString(),
      //           category: lastVisitedSnapshot.category,
      //           value: lastVisitedSnapshot.value,
      //           coordinate: lastVisitedSnapshot.coordinate,
      //         });
      //         break;
      //       }
      //     }
      //   });
      // }

      const myNewCards = await Card.aggregate([
        { $match: { createdBy: user_id } },
        {
          $match: {
            "snapshots.createdAt": new Date(currentDate).toLocaleDateString(),
          },
        },
      ]);

      socket.emit("getMyCards", myNewCards);
    });

    socket.on("createCard", async (data) => {
      const { socketValue } = data;
      const {
        currentDate,
        createdBy,
        category,
        startDate,
        endDate,
        colorCode,
        todos,
        imgUrl,
        description,
        x,
        y,
      } = socketValue;

      const hey = await Card.create({
        createdBy,
        colorCode,
        period: { startDate, endDate },
        snapshots: [
          {
            createdAt: new Date().toLocaleDateString(),
            category,
            value: {
              todos,
              imgUrl,
              description,
            },
            coordinate: { x, y },
          },
        ],
      });

      const myCards = await Card.aggregate([
        { $match: { createdBy } },
        {
          $match: {
            "snapshots.createdAt": new Date(currentDate).toLocaleDateString(),
          },
        },
      ]);

      socket.emit("getMyCards", { myCards });
    });

    socket.on("modifyCard", async (data) => {
      console.log("modify back🔥", data);
      const { socketValue } = data;
      const {
        snapshotId,
        currentDate,
        createdBy,
        category,
        startDate,
        endDate,
        colorCode,
        todos,
        imgUrl,
        description,
        x,
        y,
      } = socketValue;

      const myCards = await Card.aggregate([
        { $match: { createdBy } },
        {
          $match: {
            "snapshots.createdAt": new Date(currentDate).toLocaleDateString(),
          },
        },
      ]);

      const modi = { category, value: { todos, imgUrl, description } };

      myCards[0].snapshots[0] = modi;

      socket.emit("getMyCards", myCards);
    });

    socket.on("sendNotice", (data) => {
      console.log(data);
    });

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });

    socket.on("error", (error) => {
      console.error(`Connection failed: ${error}`);
    });
  });
};
