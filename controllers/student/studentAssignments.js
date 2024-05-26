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

    // get also the assignment_submission for the student
    const result3 = await getAss(instructor_id, courseId);
    for (let i = 0; i < result3.length; i++) {
      const query6 = `SELECT * FROM assignment_submission WHERE student_id = ? AND assignment_id = ?`;
      const [result6] = await connection.query(query6, [
        studentId,
        result3[0].id,
      ]);
      if (result6.length > 0) {
        result3[i].submission = result6[0];
      }
    }

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
    const query = `
      SELECT a.*, c.title as course_title
      FROM assignments a
      JOIN course c ON a.course_id = c.id
      WHERE course_id IN (
        SELECT course_id
        FROM takes
        WHERE student_id = ?
      )
      ORDER BY a.due_date ASC
    `
    const [assignments] = await connection.query(query, [studentId]);

    res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const submitAssignment = async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;
    const studentId = req.user;
    const query = `SELECT * FROM takes WHERE course_id = ? AND student_id = ?`;
    const [result] = await connection.query(query, [courseId, studentId]);
    if (result.length === 0) {
      throw new Error("Not registered for course");
    }
    const query2 = `SELECT * FROM assignments WHERE id = ?`;
    const [result2] = await connection.query(query2, [assignmentId]);
    if (result2.length === 0) {
      throw new Error("Assignment not found");
    }
    // check if assignment is already submitted
    const query6 = `SELECT * FROM assignment_submission WHERE assignment_id = ? AND student_id = ?`;
    const [result6] = await connection.query(query6, [assignmentId, studentId]);
    if (result6.length > 0) {
      throw new Error("Assignment already submitted");
    }
    const upload = await uploadFile(req.file.path);
    const query3 = `INSERT INTO assignment_submission (id, file_path, submission_date, assignment_id, student_id)
     VALUES (?, ?, ?, ?, ?)`;
    const [result3] = await connection.query(query3, [
      upload.public_id,
      upload.url,
      new Date(),
      assignmentId,
      studentId,
    ]);
    res.status(200).json({ success: true, data: result3 });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getAssginments, submitAssignment, getAllAssignments };
