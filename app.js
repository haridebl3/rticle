const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require("./routes/user")
const port = process.env.PORT || 4000;
const app = express();

app.use(bodyParser.json());
app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});
app.listen(port, () => {
  console.log(`Node server is listening on port ${port}`);
});
