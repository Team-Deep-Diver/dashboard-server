const { Server } = require("socket.io");

const Card = require("../models/Card");
const Snapshot = require("../models/Snapshot");

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

      const myCards = await Card.find({
        createdBy: user_id,
        "period.startDate": {
          $lte: new Date(currentDate).toLocaleDateString(),
        },
        "period.endDate": { $gte: new Date(currentDate).toLocaleDateString() },
      }).populate("Snapshot");
      console.log(myCards);

      if (myCards.length > 0) {
        return socket.emit("getMyCards", myCards);
      }

      console.log("실행되고있음?");
      // 우선 해당하는 카드 리스트 모두 찾아서
      // 각 카드의 필요한 스냅샷을 찾은 뒤,
      // 해당 스냅샷의 새로운 스냅샷을 저장
      const periodMatchedCards = await Card.find({
        createdBy: user_id,
        "period.startDate": {
          $lte: new Date(currentDate).toLocaleDateString(),
        },
        "period.endDate": { $gte: new Date(currentDate).toLocaleDateString() },
        "snapshots.createdAt": {
          $lte: new Date(currentDate).toLocaleDateString(),
        },
      });

      console.log(periodMatchedCards);
      periodMatchedCards.forEach(async (card) => {
        const recentSnapshot = card.snapshots[card.snapshots.length - 1];
        console.log(recentSnapshot);

        const newnew = await Card.updateOne(
          {
            createdBy: user_id,
            "period.startDate": {
              $lte: new Date(currentDate).toLocaleDateString(),
            },
            "period.endDate": {
              $gte: new Date(currentDate).toLocaleDateString(),
            },
          },
          {
            $push: {
              snapshots: {
                createdAt: new Date(currentDate).toLocaleDateString(),
                category: recentSnapshot.category,
                value: recentSnapshot.value,
                coordinate: recentSnapshot.coordinate,
              },
            },
          }
        );

        console.log("여기여기", newnew);
      });
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

      const snapshot = await Snapshot.create({
        createdAt: new Date().toLocaleDateString(),
        category,
        value: {
          todos,
          imgUrl,
          description,
        },
        coordinate: { x, y },
      })

      await Card.create({
        createdBy,
        colorCode,
        period: {
          startDate: new Date(startDate).toLocaleDateString(),
          endDate: new Date(endDate).toLocaleDateString(),
        },
        snapshots: snapshot._id
      });

      const myCards = await Card.find({
        createdBy,
        "snapshots.createdAt": new Date(currentDate).toLocaleDateString(),
      });

      socket.emit("getMyCards", { myCards });
    });

    socket.on("modifyCard", (data) => {
      console.log(data.socketValue);
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
