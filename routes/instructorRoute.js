const express = require("express");
const {
  getCourses,
  teachCourse,
  // leaveCourse,
  getAllStudents,
  assignStudentToCourse,
  deleteCourse,
} = require("../controllers/instructor/instructorCourses");
const {
  getAssignments,
  // submitAssignment,
  CreateAssignment,
  uploadAssignmentFile,
  deleteAssignment,
  getSubmissions,
} = require("../controllers/instructor/instructorAssignments");
const {
  getWeeks,
  createWeek,
  addWeekFile,
  CreateWeek,
  uploadWeekFile,
  deleteWeek,
} = require("../controllers/instructor/instructorWeeks");
const {
  getAnnouncements,
  createAnnouncement,
} = require("../controllers/instructor/instructorAnnouncements");

const multer = require("multer");
const {
  AllCoursesDetails,
  getCourseDetails,
} = require("../controllers/instructor/AllCoursesDetails");

var uploader = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 500000 },
});

const router = express.Router();

router.get("/AllStudents", getAllStudents);

router.get("/AllCoursesDetails", AllCoursesDetails);
router.get("/getCourseDetails/:id", getCourseDetails);

router.get("/courses", getCourses);
router.post("/courses", teachCourse);
router.post("/courses/Assign_student", assignStudentToCourse);
router.delete("/courses/:id", deleteCourse);
// router.delete("/courses/:id", leaveCourse);

router.get("/announcements/:id", getAnnouncements);
router.post("/announcements/:id", createAnnouncement);

router.get("/getWeeks/:courseId", getWeeks);
router.post("/createNewWeek/:courseId", CreateWeek);
router.delete("/deleteWeek/:weekId", deleteWeek);
router.post(
  "/uploadWeekFile/:courseId/:weekId",
  uploader.single("file"),
  uploadWeekFile
);

router.get("/getAssignments/:courseId", getAssignments);
router.post("/createAssignment/:courseId", CreateAssignment);
router.delete("/deleteAssignment/:assignmentId", deleteAssignment);
router.post(
  "/uploadAssignmentFile/:assignmentId",
  uploader.single("file"),
  uploadAssignmentFile
);
router.get("/AllSubmissions/:assignmentId", getSubmissions);
// router.post("/gradeAssignment/:assignmentId", gradeAssignment);
module.exports = router;

// router.get("/weeks/:id", getWeeks);
// router.post("/weeks/:id", createWeek);
// router.post(
//   "/uploadWeekFile/:courseId",
//   uploader.single("file"),
//   uploadWeekFile
// );
