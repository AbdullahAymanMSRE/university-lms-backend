const connection = require("../../utils/db");
const {
  uploadFile,
  getFile,
  deleteFile,
} = require("../../services/cloudinary");
const getAssginments = async (req, res) => {
  try {
    const { courseId } = req.params;
    // find instructor_id from takes table where course_id = courseId
    const query4 = `SELECT instructor_id FROM takes WHERE course_id = ?`;
    const [result4] = await connection.query(query4, [courseId]);
    const instructor_id = result4[0].instructor_id;
    const query = `SELECT * FROM assignments WHERE course_id = ? AND instructor_id = ?`;
    const [result] = await connection.query(query, [courseId, instructor_id]);
    const query2 = `SELECT * FROM assignment_files WHERE assignment_id = ?`;
    const result2 = [];
    for (let i = 0; i < result.length; i++) {
      const [files] = await connection.query(query2, [result[i].id]);
      const file = await getFile(files.path);
      result.file = file;
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
const submitAssignment = async (req, res) => {};

module.exports = { getAssginments, submitAssignment };
