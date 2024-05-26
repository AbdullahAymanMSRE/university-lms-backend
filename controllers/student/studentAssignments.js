const connection = require("../../utils/db");
const {
  uploadFile,
  getFile,
  deleteFile,
} = require("../../services/cloudinary");

const getAss = async (instructor_id, courseId) => {
  const query = `SELECT * FROM assignments WHERE course_id = ? AND instructor_id = ?`;
  const [result] = await connection.query(query, [courseId, instructor_id]);
  const query2 = `SELECT * FROM assignment_files WHERE assignment_id = ?`;
  const result2 = [];
  for (let i = 0; i < result.length; i++) {
    const [files] = await connection.query(query2, [result[i].id]);
    // const file = await getFile(files.path);
    // result.file = file;
    result2.push(files);
  }
  const result3 = [];
  for (let i = 0; i < result.length; i++) {
    result3.push({ ...result[i], files: result2[i] });
  }
  return result3;
};

const getAssginments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user;
    const query5 = `SELECT * FROM takes WHERE student_id = ?`;
    const [result5] = await connection.query(query5, [studentId]);
    if (result5.length === 0) {
      throw new Error("Not registered for course");
    }
    const query4 = `SELECT instructor_id FROM takes WHERE course_id = ?`;
    const [result4] = await connection.query(query4, [courseId]);
    const instructor_id = result4[0].instructor_id;
    // const query = `SELECT * FROM assignments WHERE course_id = ? AND instructor_id = ?`;
    // const [result] = await connection.query(query, [courseId, instructor_id]);
    // const query2 = `SELECT * FROM assignment_files WHERE assignment_id = ?`;
    // const result2 = [];
    // for (let i = 0; i < result.length; i++) {
    //   const [files] = await connection.query(query2, [result[i].id]);
    //   const file = await getFile(files.path);
    //   result.file = file;
    //   result2.push(files);
    // }
    // const result3 = [];
    // for (let i = 0; i < result.length; i++) {
    //   result3.push({ ...result[i], files: result2[i] });
    // }
    const result3 = await getAss(instructor_id, courseId);
    res.status(200).json({ success: true, data: result3 });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllAssignments = async (req, res) => {
  try {
    console.log("***");
    const studentId = req.user;

    // Fetch all courses for the student
    const courseQuery = `
      SELECT t.*, c.*, i.name as instructor_name 
      FROM takes t 
      LEFT JOIN course c ON c.id = t.course_id 
      LEFT JOIN instructor i ON t.instructor_id = i.id 
      WHERE t.student_id = ?`;
    const [courses] = await connection.query(courseQuery, [studentId]);

    // Initialize an array to hold the courses with their assignments
    let coursesWithAssignments = [];
    console.log(courses);
    // Loop through each course to fetch its assignments
    for (const course of courses) {
      const query4 = `SELECT instructor_id FROM takes WHERE course_id = ?`;
      const [result4] = await connection.query(query4, [course.course_id]);
      const instructor_id = result4[0].instructor_id;
      const assignments = await getAss(instructor_id, course.course_id);
      console.log(assignments, instructor_id, course.course_id);
      coursesWithAssignments.push({
        ...course,
        assignments: assignments,
      });
    }

    res.status(200).json({ success: true, data: coursesWithAssignments });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const submitAssignment = async (req, res) => {};

module.exports = { getAssginments, submitAssignment, getAllAssignments };
