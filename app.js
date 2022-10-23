const path = require("path");
const logger = require("morgan");
const express = require("express");
const createError = require("http-errors");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const usersRouter = require("./routes/users");
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const groupsRouter = require("./routes/groups");
const logoutRouter = require("./routes/logout");

const connectMongoDB = require("./configs/connectMongoDB");
const passportConfig = require("./configs/passportConfig");
connectMongoDB();
const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

// app.use("/", indexRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
// app.use(passport.authenticate("jwt", { session: false }));

// 얘는 곧 지울 것. 서버에 올라가 있는 애임.
app.use("/logout", function (req, res, next) {
  req.logout((err) => {
    if (err) {
      return res.send(createError(400, ERROR.NO_ACCOUNT));
    }

    // return res.status(200).redirect("/login");
    return res.status(200).send("logout🔥");
  });
});

// app.use(passport.authenticate("jwt", { session: false }));
app.use("/users", usersRouter);
app.use("/groups", groupsRouter);
app.use("/logout", logoutRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
