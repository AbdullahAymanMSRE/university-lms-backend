const express = require("express");
const instructorAuth = require("../middleware/studentAuth");
const {
  getCourses,
  registerCourse,
  dropCourse,
} = require("../controllers/studentCourses");
const router = express.Router();

router.use(instructorAuth);

router.get("/", getCourses);

router.post("/", registerCourse);

router.delete("/:id", dropCourse);

module.exports = router;
