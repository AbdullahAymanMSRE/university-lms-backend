const express = require("express");
const { login, signup } = require("../controllers/instructorLogin");
const instructorAuth = require("../middleware/instructorAuth");
const {
  getCourses,
  teachCourse,
  leaveCourse,
} = require("../controllers/instructorCourses");

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);

router.use(instructorAuth);

const coursesRouter = express.Router();
router.use("/courses", coursesRouter);
coursesRouter.get("/", getCourses);
coursesRouter.post("/:id", teachCourse);
coursesRouter.delete("/:id", leaveCourse);

module.exports = router;
