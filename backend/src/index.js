const dotenv = require("dotenv");
const connectDB = require("./db");
const {app} = require("./app");

dotenv.config({
  path: "./.env",
});

// connecting to db
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("Error: ", error.message);
      throw error;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log("⚙ Server is running at port :", process.env.PORT);
    });
  })
  .catch((error) => console.log("MongoDB connection failed: ", error.message));