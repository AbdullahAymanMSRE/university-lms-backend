const connection = require("../../utils/db");

const getAllAnnouncements = async (req, res) => {
  try {
    const studentId = req.user;

    // Fetch all courses for the student
    const query = `
      SELECT a.*, c.title as course_title, i.name as instructor_name
      FROM announcements a
      JOIN course c ON a.course_id = c.id
      JOIN instructor i ON i.id = a.instructor_id
      WHERE a.course_id IN (
        SELECT course_id
        FROM takes 
        WHERE student_id = ?
      )
      ORDER BY a.announcement_date ASC
    `
    const [announcements] = await connection.query(query, [studentId]);

    res.status(200).json({ success: true, data: announcements });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
module.exports = { getAllAnnouncements };