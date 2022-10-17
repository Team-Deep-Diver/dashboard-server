const io = require("../bin/www");

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });

  socket.on("error", (error) => {
    console.error(`Connection failed: ${error}`);
  });
});
