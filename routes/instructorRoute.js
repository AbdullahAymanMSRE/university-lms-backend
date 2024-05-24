const express = require("express");
const {
  getCourses,
  teachCourse,
  // leaveCourse,
  getAllStudents,
} = require("../controllers/instructor/instructorCourses");
const {
  getAssginments,
  submitAssignment,
} = require("../controllers/instructor/instructorAssignments");
const {
  getWeeks,
  createWeek,
  addWeekFile,
} = require("../controllers/instructor/instructorWeeks");
const {
  getAnnouncements,
  createAnnouncement,
} = require("../controllers/instructor/instructorAnnouncements");

const router = express.Router();

router.get("/AllStudents", getAllStudents);

router.get("/courses", getCourses);
router.post("/courses", teachCourse);
// router.delete("/courses/:id", leaveCourse);

router.get("/assignments/:id", getAssginments);
router.post("/assignments/:id", submitAssignment);

router.get("/announcements/:id", getAnnouncements);
router.post("/announcements/:id", createAnnouncement);

router.get("/weeks/:id", getWeeks);
router.post("/weeks/:id", createWeek);
router.post("/weeks/:id/files", addWeekFile);

module.exports = router;
