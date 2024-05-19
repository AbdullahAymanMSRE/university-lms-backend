const express = require("express");
const {
  getCourses,
  teachCourse,
  leaveCourse,
} = require("../controllers/instructor/instructorCourses");
const {
  getAssginments,
  submitAssignment,
} = require("../controllers/instructor/instructorAssignments");
const {
  getWeeks,
  createWeek,
} = require("../controllers/instructor/instructorWeeks");

const router = express.Router();

router.get("/courses", getCourses);
router.post("/courses/:id", teachCourse);
router.delete("/courses/:id", leaveCourse);

router.get("/assignments/:id", getAssginments);
router.post("/assignments/:id", submitAssignment);

router.get("/weeks/:id", getWeeks);
router.post("/weeks/:id", createWeek);

module.exports = router;
