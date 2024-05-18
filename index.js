const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const connection = require("./utils/db");
const instructorRoute = require("./routes/instructorRoute");
const studentRoute = require("./routes/studentRoute");
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LMS API",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
// const swaggerSpec = swaggerJSDoc(options);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());

app.use("/api/instructor", instructorRoute);
app.use("/api/student", studentRoute);

app.listen(process.env.PORT, () => {
  console.log("Server started on port, ", process.env.PORT);
});
