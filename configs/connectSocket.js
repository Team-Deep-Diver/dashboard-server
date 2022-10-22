const { Server } = require("socket.io");

const { Card, Snapshot } = require("../models/Card");
const Notice = require("../models/Notice");
const Group = require("../models/Group");

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

    socket.on("modifyCard", async (data) => {
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

      await Snapshot.findOneAndUpdate(
        {
          _id: snapshotId,
        },
        {
          category: category,
          todos: todos,
          imgUrl: imgUrl,
          description: description,
        }
      );

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

    socket.on("deleteCard", async (data) => {
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

      await Snapshot.findOneAndDelete({ _id: snapshotId });

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

    socket.on("sendNotice", async (data) => {
      const { socketValue } = data;
      const { adminId, groupList, startDate, endDate, groupNotice } =
        socketValue;
      const newNotice = await Notice.create({
        message: groupNotice,
        period: { startDate, endDate },
      });

      const adminGroup = await Group.findOneAndUpdate(
        { admin: adminId },
        { $push: { notices: newNotice._id } },
        { new: true }
      );
      const { name, colorCode } = adminGroup;
      socket.emit(groupList[0], { name, colorCode, newNotice });
    });

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });

    socket.on("error", (error) => {
      console.error(`Connection failed: ${error}`);
    });
  });
};
