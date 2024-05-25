const express = require("express");
const {
  getCourses,
  teachCourse,
  // leaveCourse,
  getAllStudents,
  assignStudentToCourse,
} = require("../controllers/instructor/instructorCourses");
const {
  getAssignments,
  // submitAssignment,
  CreateAssignment,
  uploadAssignmentFile,
  deleteAssignment,
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

const multer = require("multer");

var uploader = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 500000 },
});

const router = express.Router();

router.get("/AllStudents", getAllStudents);

router.get("/courses", getCourses);
router.post("/courses", teachCourse);
router.post("/courses/Assign_student", assignStudentToCourse);
// router.delete("/courses/:id", leaveCourse);

router.get("/announcements/:id", getAnnouncements);
router.post("/announcements/:id", createAnnouncement);

router.get("/weeks/:id", getWeeks);
router.post("/weeks/:id", createWeek);
router.post("/weeks/:id/files", addWeekFile);

router.get("/getAssignments/:courseId", getAssignments);
router.post("/createAssignment/:courseId", CreateAssignment);
router.delete("/deleteAssignment/:assignmentId", deleteAssignment);
router.post(
  "/uploadAssignmentFile/:assignmentId",
  uploader.single("file"),
  uploadAssignmentFile
);
module.exports = router;
