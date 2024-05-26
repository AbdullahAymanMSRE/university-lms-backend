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
const {
  AllCoursesDetails,
} = require("../controllers/student/AllCourseDetails");

const router = express.Router();

router.get("/AllCoursesDetails", AllCoursesDetails);

router.get("/courses", getCourses);
// router.post("/courses/:id", registerCourse);
router.delete("/courses/:id", dropCourse);

router.get("/getAssignments/:courseId", getAssginments);
router.get("/allAssignments/", getAllAssignments);
router.post("/submitAssignment/:courseId/:assignmentId", submitAssignment);

router.get("/weeks/:id", getCourse);

router.get("/announcements/:id", getAnnouncements);

module.exports = router;
