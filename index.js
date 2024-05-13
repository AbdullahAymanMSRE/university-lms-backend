const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRouter");
const connection = require("./utils/db");
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server started on port, ", process.env.PORT);
});
