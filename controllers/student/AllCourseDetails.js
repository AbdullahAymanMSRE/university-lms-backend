const connection = require("../../utils/db");

// Get all courses and each course contains all the weeks, assignments, announcements, students
const AllCoursesDetails = async (req, res) => {
  try {
    const studentId = req.user;
    const query = `SELECT course_id, instructor_id FROM takes WHERE student_id = ?`;
    const [courses] = await connection.query(query, [studentId]);
    const result = [];

    for (let i = 0; i < courses.length; i++) {
      const courseId = courses[i].course_id;
      const instructorId = courses[i].instructor_id;
      const query1 = `SELECT * FROM weeks WHERE course_id = ? AND instructor_id = ?`;
      const [weeks] = await connection.query(query1, [courseId, instructorId]);

      for (let j = 0; j < weeks.length; j++) {
        const weekId = weeks[j].id;
        const query3 = `SELECT * FROM week_files WHERE week_id = ?`;
        const [weekFiles] = await connection.query(query3, [weekId]);
        weeks[j].weekFiles = weekFiles;
      }

      const query2 = `SELECT * FROM assignments WHERE course_id = ? AND instructor_id = ?`;
      const [assignments] = await connection.query(query2, [
        courseId,
        instructorId,
      ]);

      for (let j = 0; j < assignments.length; j++) {
        const assignmentId = assignments[j].id;
        const query3 = `SELECT * FROM assignment_files WHERE assignment_id = ?`;
        const [files] = await connection.query(query3, [assignmentId]);
        assignments[j].files = files;
        // for each assignment get the submission of the student
        const query4 = `SELECT * FROM assignment_submission WHERE student_id = ? AND assignment_id = ?`;
        const [submission] = await connection.query(query4, [
          studentId,
          assignmentId,
        ]);
        assignments[j].submission = submission;
      }

      const query3 = `SELECT * FROM announcements WHERE course_id = ? AND instructor_id = ?`;
      const [announcements] = await connection.query(query3, [
        courseId,
        instructorId,
      ]);

      const query5 = `SELECT title, credit_hours FROM course WHERE id = ?`;
      const [courseDetails] = await connection.query(query5, [courseId]);
      const courseInfo = {
        ...courses[i],
        ...courseDetails[i],
        weeks,
        assignments,
        announcements,
      };

      result.push(courseInfo);
    }

    res.status(200).json({ success: true, courses_data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// do the same but for only one course i will get in the req.params the course id

const getCourseDetails = async (req, res) => {
  try {
    const studentId = req.user;
    const courseId = req.params.id;
    const query = `SELECT instructor_id FROM takes WHERE student_id = ? AND course_id = ?`;
    const [courses] = await connection.query(query, [studentId, courseId]);
    const instructorId = courses[0].instructor_id;
    if (!instructorId) {
      throw new Error("You are not enrolled in this course");
    }
    const query1 = `SELECT * FROM weeks WHERE course_id = ? AND instructor_id = ?`;
    const [weeks] = await connection.query(query1, [courseId, instructorId]);

    for (let j = 0; j < weeks.length; j++) {
      const weekId = weeks[j].id;
      const query3 = `SELECT * FROM week_files WHERE week_id = ?`;
      const [weekFiles] = await connection.query(query3, [weekId]);
      weeks[j].weekFiles = weekFiles;
    }

    const query2 = `SELECT * FROM assignments WHERE course_id = ? AND instructor_id = ?`;
    const [assignments] = await connection.query(query2, [
      courseId,
      instructorId,
    ]);

    for (let j = 0; j < assignments.length; j++) {
      const assignmentId = assignments[j].id;
      const query3 = `SELECT * FROM assignment_files WHERE assignment_id = ?`;
      const [files] = await connection.query(query3, [assignmentId]);
      assignments[j].files = files;
    }
    // for each assignmet get the submission of the student
    for (let j = 0; j < assignments.length; j++) {
      const assignmentId = assignments[j].id;
      const query4 = `SELECT * FROM assignment_submission WHERE student_id = ? AND assignment_id = ?`;
      const [submission] = await connection.query(query4, [
        studentId,
        assignmentId,
      ]);
      assignments[j].submission = submission;
    }

    const query3 = `SELECT * FROM announcements WHERE course_id = ? AND instructor_id = ?`;
    const [announcements] = await connection.query(query3, [
      courseId,
      instructorId,
    ]);

    const query5 = `SELECT title, credit_hours FROM course WHERE id = ?`;
    const [courseDetails] = await connection.query(query5, [courseId]);
    const courseInfo = {
      ...courses[0],
      ...courseDetails[0],
      weeks,
      assignments,
      announcements,
    };

    res.status(200).json({ success: true, courses_data: courseInfo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { AllCoursesDetails, getCourseDetails };
