const connection = require("../utils/db");
const getCourses = async (req, res) => {
  const user_id = req.user._id;
  const query = `select * from takes where user_id = ?`;
  res.status(200).json(tasks);
};

const registerCourse = async (req, res) => {
  const { course_id } = req.body;
  try {
    const query = `select * from course where course_id = ?`;
    const [course] = await connection.promise().query(query, [course_id]);
    if (course.length === 0) {
      throw new Error("No such course");
    }
    const user_id = req.user._id;
    query = `insert into takes (user_id, course_id) values (?, ?)`;
    await connection.promise().query(query, [user_id, course_id]);
    res.status(200).json({ message: "Course registered" });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const dropCourse = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user._id;
  query = `select * from takes where user_id = ? and course_id = ?`;
  const [takes] = await connection.promise().query(query, [user_id, id]);
  if (takes.length === 0) {
    return res
      .status(404)
      .json({ error: "User are not registered for course" });
  }
  query = `delete from takes where user_id = ? and course_id = ?`;
  await connection.promise().query(query, [user_id, id]);
  res.status(200).json({ message: "Course dropped" });
  const task = await Task.findOneAndDelete({ _id: id });
  if (!task) {
    res.status(400).json({ error: "No such task" });
  }
  res.status(200).json(task);
};

module.exports = {
  getCourses,
  registerCourse,
  dropCourse,
};
