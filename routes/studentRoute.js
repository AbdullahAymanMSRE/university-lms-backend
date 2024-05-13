const express = require("express");
const { login, signup } = require("../controllers/studentLogin");
const studentAuth = require("../middleware/studentAuth");
const {
  getCourses,
  registerCourse,
  dropCourse,
} = require("../controllers/studentCourses");

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);

router.use(studentAuth);

const coursesRouter = express.Router();
router.use("/courses", coursesRouter);
coursesRouter.get("/", getCourses);
coursesRouter.post("/:id", registerCourse);
coursesRouter.delete("/:id", dropCourse);

module.exports = router;
