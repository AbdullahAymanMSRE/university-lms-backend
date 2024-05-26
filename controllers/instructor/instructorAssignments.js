const {
  uploadFile,
  getFile,
  deleteFile,
} = require("../../services/cloudinary");
const connection = require("../../utils/db");
const CreateAssignment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const instructor_id = req.user;
    const { name, description, due_date } = req.body;
    const query1 = `SELECT * FROM teaches WHERE course_id = ? AND instructor_id = ?`;
    const values1 = [courseId, instructor_id];
    const [result1] = await connection.query(query1, values1);
    if (result1.length === 0) {
      throw new Error("You are not teaching this course");
    }
    const query = `INSERT INTO assignments (name, description, due_date, course_id, instructor_id) VALUES (?, ?, ?, ?, ?)`;
    const values = [name, description, due_date, courseId, instructor_id];
    const [result] = await connection.query(query, values);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
const uploadAssignmentFile = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const instructor_id = req.user;
    const query1 = `SELECT * FROM assignments WHERE id = ?`;
    const [result1] = await connection.query(query1, [assignmentId]);
    if (result1.length === 0) {
      throw new Error("No assignment exists with this id");
    }
    const query4 = `SELECT instructor_id FROM assignments WHERE id = ?`;
    const [result4] = await connection.query(query4, assignmentId);
    if (result4[0].instructor_id !== instructor_id) {
      throw new Error("No assignment exists");
    }
    const upload = await uploadFile(req.file.path);
    const query = `INSERT INTO assignment_files (id, path, assignment_id) VALUES (?, ?, ?)`;
    const values = [upload.public_id, upload.url, assignmentId];
    const [result] = await connection.query(query, values);
    res.status(200).json({ success: true, data: upload });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const instructor_id = req.user;
    const query1 = `SELECT * FROM teaches WHERE course_id = ? AND instructor_id = ?`;
    const values1 = [courseId, instructor_id];
    const [result1] = await connection.query(query1, values1);
    if (result1.length === 0) {
      throw new Error("You are not teaching this course");
    }
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
    res.status(200).json({ success: true, data: result3 });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const query1 = `SELECT * FROM assignments WHERE id = ?`;
    const [result1] = await connection.query(query1, [assignmentId]);
    if (result1.length === 0) {
      throw new Error("No assignment exists with this id");
    }
    const query3 = `SELECT * FROM assignment_files WHERE assignment_id = ?`;
    const [result3] = await connection.query(query3, [assignmentId]);
    for (let i = 0; i < result3.length; i++) {
      await deleteFile(result3[i].id);
    }
    const query2 = `DELETE FROM assignment_files WHERE assignment_id = ?`;
    const [result2] = await connection.query(query2, [assignmentId]);
    const query = `DELETE FROM assignments WHERE id = ?`;
    const [result] = await connection.query(query, [assignmentId]);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const instructor_id = req.user;
    const query1 = `SELECT * FROM assignments WHERE id = ? AND instructor_id = ?`;
    const [result1] = await connection.query(query1, [
      assignmentId,
      instructor_id,
    ]);
    if (result1.length === 0) {
      throw new Error("No assignment exists with this id");
    }
    const query = `SELECT * FROM assignment_submission WHERE assignment_id = ?`;
    const [result] = await connection.query(query, [assignmentId]);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAssignments,
  CreateAssignment,
  uploadAssignmentFile,
  deleteAssignment,
  getSubmissions,
};
