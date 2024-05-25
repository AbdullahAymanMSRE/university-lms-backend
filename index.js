const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const swaggerUi = require("swagger-ui-express");
// const swaggerJSDoc = require("swagger-jsdoc");
const connection = require("./utils/db");
const instructorRoute = require("./routes/instructorRoute");
// const userAuth = require("./middleware/userAuth");
const LoginRoute = require("./routes/loginRoute");
const studentRoute = require("./routes/studentRoute");
const studentAuth = require("./middleware/studentAuth");
const instructorAuth = require("./middleware/instructorAuth");
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const test = require("./service/test");
// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "LMS API",
//       version: "1.0.0",
//       description: "A simple Express Library API",
//     },
//     servers: [
//       {
//         url: "http://localhost:3000",
//       },
//     ],
//   },
//   apis: ["./routes/*.js"],
// };
// const swaggerSpec = swaggerJSDoc(options);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());

app.use("/api", LoginRoute);
app.use("/api/instructor", instructorAuth, instructorRoute);
app.use("/api/student", studentAuth, studentRoute);
app.use((req, res) => {
  res.status(404).json({ message: "404 - Not Found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started on port, ", process.env.PORT);
});
