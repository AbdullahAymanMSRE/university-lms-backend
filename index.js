const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./utils/db");
// const instructorCourses = require("./routes/instructorCourses");
const studentRoute = require("./routes/studentRoute");
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/api/instructor", instructorCourses);
app.use("/api/student", studentRoute);

app.listen(process.env.PORT, () => {
  console.log("Server started on port, ", process.env.PORT);
});
