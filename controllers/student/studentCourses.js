const connection = require("../../utils/db");

const getCourse = async (req, res) => {
  try {
    // get all the content from the week table where course_id = req.param
    const { id } = req.params;
    const query = `select * from weeks where course_id = ?`;
    const [course] = await connection.query(query, [id]);
    if (course.length === 0) {
      throw new Error("Course not found");
    }
    res.status(200).json(course[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const userid = req.user;
    const query = `select * from takes where student_id = ?`;
    const [courses] = await connection.query(query, [userid]);
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// const registerCourse = async (req, res) => {
//   const courseId = req.params.id;
//   try {
//     let query = `select * from course where id = ?`;
//     const [course] = await connection.query(query, [courseId]);
//     if (course.length === 0) {
//       throw new Error("No such course");
//     }
//     const userid = req.user;
//     query = `select * from takes where student_id = ? and course_id = ?`;
//     const [takes] = await connection.query(query, [userid, courseId]);
//     if (takes.length > 0) {
//       throw new Error("Already registered for course");
//     }
//     query = `insert into takes (student_id, course_id) values (?, ?)`;
//     await connection.query(query, [userid, courseId]);
//     res.status(200).json({ message: "Course registered" });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

const dropCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userid = req.user;
    query = `select * from takes where student_id = ? and course_id = ?`;
    const [takes] = await connection.query(query, [userid, id]);
    if (takes.length === 0) {
      return res
        .status(404)
        .json({ error: "User are not registered for course" });
    }
    query = `delete from takes where student_id = ? and course_id = ?`;
    await connection.query(query, [userid, id]);
    res.status(200).json({ message: "Course dropped" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const courseId = req.params.id;
    // get the instructor_id from the takes table
    const query1 = `SELECT * FROM takes WHERE course_id = ?`;
    const [instructor] = await connection.query(query1, [courseId]);
    if (instructor.length === 0) {
      throw new Error("No such course");
    }
    const instructor_id = instructor[0].instructor_id;
    const query = `SELECT * FROM announcements WHERE course_id = ? AND instructor_id = ?`;
    const [announcements] = await connection.query(query, [
      courseId,
      instructor_id,
    ]);
    res.status(200).json(announcements);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  getCourse,
  getCourses,
  // registerCourse,
  dropCourse,
  getAnnouncements,
};
