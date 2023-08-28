const mongoose = require("mongoose");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const connect = () => {
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }

  const { username, password, host } = config;
  const uri = `mongodb+srv://${username}:${password}@${host}/?retryWrites=true&w=majority`;

  mongoose
    .connect(uri, {
      dbName: "nodejs",
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("mongodb connection");
    })
    .catch((err) => {
      console.error("mongodb connection error", err);
    });
};

mongoose.connection.on("error", (err) => {
  console.error("mongodb connection error", err);
});
mongoose.connection.on("disconnected", () => {
  console.error("mongodb connection disconnected, trying to reconnect...");
  connect();
});

module.exports = connect;
