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
  getCourseDetails,
} = require("../controllers/student/AllCourseDetails");
const {
  getAllAnnouncements,
} = require("../controllers/student/studentAnnouncements");

const multer = require("multer");

var uploader = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = express.Router();

router.get("/AllCoursesDetails", AllCoursesDetails);
router.get("/getCourseDetails/:id", getCourseDetails);

router.get("/courses", getCourses);
// router.post("/courses/:id", registerCourse);
router.delete("/courses/:id", dropCourse);

router.get("/getAssignments/:courseId", getAssginments);
router.get("/allAssignments/", getAllAssignments);
router.get("/announcements/", getAllAnnouncements);

router.post(
  "/submitAssignment/:courseId/:assignmentId",
  uploader.single("file"),
  submitAssignment
);

router.get("/weeks/:id", getCourse);

router.get("/announcements/:id", getAnnouncements);

module.exports = router;
