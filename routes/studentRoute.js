const express = require("express");
const {
  getCourses,
  // registerCourse,
  dropCourse,
  getCourse,
  getAnnouncements,
} = require("../controllers/student/studentCourses");
const {
  getAssginments,
  getAllAssignments,
  submitAssignment,
} = require("../controllers/student/studentAssignments");
const { getWeeks, getWeek } = require("../controllers/student/studentWeeks");
const {
  AllCoursesDetails,
} = require("../controllers/student/AllCourseDetails");

const router = express.Router();

router.get("/AllCoursesDetails", AllCoursesDetails);

router.get("/courses", getCourses);
// router.post("/courses/:id", registerCourse);
router.delete("/courses/:id", dropCourse);

router.get("/weeks/:id", getCourse);

router.get("/getAssignments/:courseId", getAssginments);
router.get("/allAssignments/", getAllAssignments);
router.post("/assignments/:courseId", submitAssignment);

router.get("/announcements/:id", getAnnouncements);

router.get("/weeks/:id", getWeeks);
router.get("/weeks/:course_id/:week_id", getWeek);

module.exports = router;
