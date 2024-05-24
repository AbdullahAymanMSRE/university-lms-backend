const connection = require("../../utils/db");
// get announcements where course_id = ?
const getAnnouncements = async (req, res) => {
  try {
    const instructorId = req.user;
    const courseId = req.params.id;
    const query = `SELECT * FROM announcements WHERE course_id = ? AND instructor_id = ?`;
    const [announcements] = await connection.query(query, [
      courseId,
      instructorId,
    ]);
    res.status(200).json(announcements);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const instructorId = req.user;
    const courseId = req.params.id;
    const { title, content } = req.body;
    const date = new Date();
    const query = `INSERT INTO announcements (title, content, announcement_date, course_id, instructor_id) VALUES (?, ?, ?, ?, ?)`;
    await connection.query(query, [
      title,
      content,
      date,
      courseId,
      instructorId,
    ]);
    res.status(200).json({ message: "Announcement created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getAnnouncements, createAnnouncement };
