const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// routes import
const userRouter = require("./routes/user.routes");
const accountRouter = require("./routes/account.routes");

// routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter);

module.exports = { app };
