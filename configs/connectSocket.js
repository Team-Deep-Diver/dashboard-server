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
      }).populate({
        path: "snapshots",
        match: { createdAt: new Date(currentDate).toLocaleDateString() }
      });

      if (myCards[0]?.snapshots.length > 0) {
        return socket.emit("getMyCards", myCards);
      }

      const recentCards = await Card.find({
        createdBy: user_id,
        "period.startDate": {
          $lte: new Date(currentDate).toLocaleDateString(),
        },
        "period.endDate": { $gte: new Date(currentDate).toLocaleDateString() },
      }).populate({
        path: "snapshots",
        match: { createdAt: { $lte: new Date(currentDate).toLocaleDateString() } }
      });

      if (recentCards.length === 0) {
        return socket.emit("getMyCards", []);
      }

      recentCards.forEach(async (card) => {
        const newSnapshot = await Snapshot.create({
          createdAt: new Date(currentDate).toLocaleDateString(),
          category: card.snapshots[card.snapshots.length - 1].category,
          value: card.snapshots[0].value,
          coordinate: card.snapshots[0].coordinate
        });

        await Card.findByIdAndUpdate(card._id, {
          $push: { snapshots: newSnapshot._id }
        });
      })

      const myNewCards = await Card.find({
        createdBy: user_id,
        "period.startDate": {
          $lte: new Date(currentDate).toLocaleDateString(),
        },
        "period.endDate": { $gte: new Date(currentDate).toLocaleDateString() },
      }).populate({
        path: "snapshots",
        match: { createdAt: new Date(currentDate).toLocaleDateString() }
      });

      if (myNewCards[0]?.snapshots.length > 0) {
        return socket.emit("getMyCards", myNewCards);
      }

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
      });

      await Card.create({
        createdBy,
        colorCode,
        period: {
          startDate: new Date(startDate).toLocaleDateString(),
          endDate: new Date(endDate).toLocaleDateString(),
        },
        snapshots: snapshot._id,
      });

      const myCards = await Card.find({
        createdBy,
        "period.startDate": {
          $lte: new Date(currentDate).toLocaleDateString(),
        },
        "period.endDate": { $gte: new Date(currentDate).toLocaleDateString() },
      }).populate({
        path: "snapshots",
        $match: { createdAt: new Date(currentDate).toLocaleDateString() },
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
