const connection = require("../../utils/db");
// get announcements where course_id = ?
const getAnnouncements = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const courseId = req.params.id;
    const query = `SELECT * FROM announcement WHERE course_id = ? AND instructor_id = ?`;
    const [announcements] = await connection.query(query, [
      courseId,
      instructorId,
    ]);
    res.status(200).json(announcements);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// create an announcement where course_id = ?
const createAnnouncement = async (req, res) => {
  console.log("createAnnouncement");
  try {
    const instructorId = req.user;
    console.log(instructorId);
    const courseId = req.params.id;
    console.log(courseId);
    const { title, content } = req.body;
    console.log(title, content);
    const query = `INSERT INTO announcement (title, content, course_id, instructor_id) VALUES (?, ?, ?, ?)`;
    await connection.query(query, [title, content, courseId, instructorId]);
    res.status(200).json({ message: "Announcement created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getAnnouncements, createAnnouncement };
