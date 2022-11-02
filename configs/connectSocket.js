const { Server } = require("socket.io");

const getTodayCards = require("../services/getTodayCards");
const getRecentCards = require("../services/getRecentCards");
const updateRecentCards = require("../services/updateRecentCards");
const createNewCard = require("../services/createNewCard");
const modifyCard = require("../services/modifyCard");
const deleteCard = require("../services/deleteCard");
const createNewNotice = require("../services/createNewNotice");

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
      const myCards = await getTodayCards(user_id, currentDate);

      if (myCards[0]?.snapshots.length > 0) {
        return socket.emit("getMyCards", myCards);
      }

      const recentCards = await getRecentCards(user_id, currentDate);

      if (recentCards.length === 0) {
        return socket.emit("getMyCards", []);
      }

      await updateRecentCards(recentCards, currentDate);

      const myNewCards = await getTodayCards(user_id, currentDate);

      if (myNewCards[0]?.snapshots.length > 0) {
        return socket.emit("getMyCards", myNewCards);
      }
    });

    socket.on("createCard", async (data) => {
      const { socketValue } = data;
      const { createdBy, currentDate } = socketValue;

      await createNewCard(socketValue);
      const myCards = await getTodayCards(createdBy, currentDate);

      socket.emit("getMyCards", myCards);
    });

    socket.on("modifyCard", async (data) => {
      const { socketValue } = data;

      if (socketValue === null) {
        return;
      } else {
        const { createdBy, currentDate } = socketValue;

        await modifyCard(socketValue);
        const myCards = await getTodayCards(createdBy, currentDate);

        socket.emit("getMyCards", myCards);
      }
    });

    socket.on("deleteCard", async (data) => {
      const { socketValue } = data;
      const { cardId, snapshotId, createdBy, currentDate } = socketValue;

      await deleteCard(cardId, snapshotId);
      const myCards = await getTodayCards(createdBy, currentDate);

      socket.emit("getMyCards", myCards);
    });

    socket.on("sendNotice", async (data) => {
      const { socketValue } = data;
      const { adminId, groupList, startDate, endDate, groupNotice } =
        socketValue;

      const { name, colorCode, newNotice } = await createNewNotice(
        adminId,
        startDate,
        endDate,
        groupNotice
      );

      socket.emit(groupList[0], {
        groupName: name,
        colorCode,
        notice: newNotice,
      });
    });

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });

    socket.on("error", (error) => {
      console.error(`Connection failed: ${error}`);
    });
  });
};
