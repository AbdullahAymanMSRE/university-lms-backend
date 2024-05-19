const connection = require("../../utils/db");
const getCourses = async (req, res) => {
  try {
    const userid = req.user;
    const query = `select * from takes where student_id = ?`;
    const [courses] = await connection.promise().query(query, [userid]);
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const registerCourse = async (req, res) => {
  const courseId = req.params.id;
  try {
    let query = `select * from course where id = ?`;
    const [course] = await connection.promise().query(query, [courseId]);
    if (course.length === 0) {
      throw new Error("No such course");
    }
    const userid = req.user;
    query = `select * from takes where student_id = ? and course_id = ?`;
    const [takes] = await connection.promise().query(query, [userid, courseId]);
    if (takes.length > 0) {
      throw new Error("Already registered for course");
    }
    query = `insert into takes (student_id, course_id) values (?, ?)`;
    await connection.promise().query(query, [userid, courseId]);
    res.status(200).json({ message: "Course registered" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const dropCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userid = req.user;
    query = `select * from takes where student_id = ? and course_id = ?`;
    const [takes] = await connection.promise().query(query, [userid, id]);
    if (takes.length === 0) {
      return res
        .status(404)
        .json({ error: "User are not registered for course" });
    }
    query = `delete from takes where student_id = ? and course_id = ?`;
    await connection.promise().query(query, [userid, id]);
    res.status(200).json({ message: "Course dropped" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getCourses,
  registerCourse,
  dropCourse,
};
