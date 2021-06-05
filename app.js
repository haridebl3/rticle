const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require("./src/routes/user");
const bufferRoute = require("./src/routes/buffer");
const port = process.env.PORT || 4000;
const app = express();

app.use(bodyParser.json());
var mongoose = require("mongoose");
const connectionString = process.env.MONGO_URL;
mongoose.Promise = global.Promise;
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected.....");
  })
  .catch((err) => {
    console.error("App starting error:", err.message);
    process.exit(1);
  });
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
app.use("/user", userRoute);
app.use("/buffer", bufferRoute);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});
app.listen(port, () => {
  console.log(`Node server is listening on port ${port}`);
});
