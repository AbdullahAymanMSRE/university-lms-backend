const connection = require("../../utils/db");

// Get all courses and each course contains all the weeks, assignments, announcements, students
const AllCoursesDetails = async (req, res) => {
  try {
    const instructorId = req.user;
    const query = `SELECT * FROM teaches WHERE instructor_id = ?`;
    const [courses] = await connection.query(query, [instructorId]);
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
        // for each assignmetn get the submission of the all the students
        const query4 = `SELECT * FROM assignment_submission WHERE assignment_id = ?`;
        const [submissions] = await connection.query(query4, [assignmentId]);
        assignments[j].submissions = submissions;
      }

      const query3 = `SELECT * FROM announcements WHERE course_id = ? AND instructor_id = ?`;
      const [announcements] = await connection.query(query3, [
        courseId,
        instructorId,
      ]);

      const query4 = `SELECT student_id FROM takes WHERE course_id = ? AND instructor_id = ?`;
      const [students] = await connection.query(query4, [
        courseId,
        instructorId,
      ]);

      const query5 = `SELECT * FROM course WHERE id = ?`;
      const [courseDetails] = await connection.query(query5, [courseId]);

      const courseInfo = {
        ...courseDetails[0],
        weeks,
        assignments,
        announcements,
        students,
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
    const instructorId = req.user;
    const courseId = req.params.id;
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
      // for each assignment get the submission of the all the students
      const query4 = `SELECT * FROM assignment_submission WHERE assignment_id = ?`;
      const [submissions] = await connection.query(query4, [assignmentId]);
      assignments[j].submissions = submissions;
    }

    const query3 = `SELECT * FROM announcements WHERE course_id = ? AND instructor_id = ?`;
    const [announcements] = await connection.query(query3, [
      courseId,
      instructorId,
    ]);

    const query4 = `SELECT student_id FROM takes WHERE course_id = ? AND instructor_id = ?`;
    const [students] = await connection.query(query4, [courseId, instructorId]);

    const query5 = `SELECT * FROM course WHERE id = ?`;
    const [courseDetails] = await connection.query(query5, [courseId]);

    const courseInfo = {
      ...courseDetails[0],
      weeks,
      assignments,
      announcements,
      students,
    };

    res.status(200).json({ success: true, course_data: courseInfo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { AllCoursesDetails, getCourseDetails };
