const { Server } = require("socket.io");

const { Card, Snapshot } = require("../models/Card");

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

      socket.emit("getMyCards", { myCards });
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

      const todosArr = todos.map((item) => {
        return {
          text: item,
          checked: false,
        };
      });

      const todaySnapshot = await Snapshot.create({
        createdAt: new Date().toLocaleDateString(),
        category,
        value: {
          todos: todosArr,
          imgUrl,
          description,
        },
        coordinate: { x, y },
      });

      const newCard = await Card.create({
        createdBy,
        colorCode,
        period: { startDate, endDate },
        snapshots: [todaySnapshot],
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
