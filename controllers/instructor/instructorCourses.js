const connection = require("../../utils/db");
// const getCourses = async (req, res) => {
//   try {
//     const userid = req.user;
//     const query = `select * from teaches where instructor_id = ?`;
//     const [courses] = await connection.query(query, [userid]);
//     res.status(200).json(courses);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

const getCourses = async (req, res) => {
  try {
    const instructorId = req.user;
    const query = `
      SELECT t.course_id, GROUP_CONCAT(t.student_id) AS students_registered
      FROM (
        SELECT c.course_id, c.instructor_id, t.student_id
        FROM teaches c
        LEFT JOIN takes t ON c.course_id = t.course_id
        WHERE c.instructor_id = ?
      ) AS t
      GROUP BY t.course_id;
    `;
    const [courses] = await connection.query(query, [instructorId]);
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    // get all the students from the student table
    const query = `SELECT * FROM student`;
    const [students] = await connection.query(query);
    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const teachCourse = async (req, res) => {
  try {
    const { title, credit_hours } = req.body;
    const instructorId = req.user;
    let query = `SELECT * FROM course WHERE title = ?`;
    const [existingCourse] = await connection.query(query, [title]);
    let courseId;
    if (existingCourse.length === 0) {
      query = `INSERT INTO course (title, credit_hours) VALUES (?, ?)`;
      const [insertedCourse] = await connection.query(query, [
        title,
        credit_hours,
      ]);
      courseId = insertedCourse.insertId;
    } else {
      courseId = existingCourse[0].id;
    }
    console.log(courseId);
    query = `SELECT * FROM teaches WHERE instructor_id = ? AND course_id = ?`;
    const [existingTeaches] = await connection.query(query, [
      instructorId,
      courseId,
    ]);
    if (existingTeaches.length > 0) {
      throw new Error("Already teaching for course");
    }
    console.log(instructorId, courseId);
    query = `INSERT INTO teaches (instructor_id, course_id) VALUES (?, ?)`;
    await connection.query(query, [instructorId, courseId]);
    query = `SELECT * FROM course`;
    const [courses] = await connection.query(query);
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// const teachCourse = async (req, res) => {
//   const courseId = req.params.id;
//   try {
//     let query = `select * from course where id = ?`;
//     const [course] = await connection.query(query, [courseId]);
//     if (course.length === 0) {
//       throw new Error("No such course");
//     }
//     const userid = req.user;
//     query = `select * from teaches where instructor_id = ? and course_id = ?`;
//     const [teaches] = await connection.query(query, [userid, courseId]);
//     if (teaches.length > 0) {
//       throw new Error("Already registered for course");
//     }
//     query = `insert into teaches (instructor_id, course_id) values (?, ?)`;
//     await connection.query(query, [userid, courseId]);
//     res.status(200).json({ message: "Course registered" });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const leaveCourse = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userid = req.user;
//     query = `select * from teaches where instructor_id = ? and course_id = ?`;
//     const [teaches] = await connection.query(query, [userid, id]);
//     if (teaches.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "User are not registered for course" });
//     }
//     query = `delete from teaches where instructor_id = ? and course_id = ?`;
//     await connection.query(query, [userid, id]);
//     res.status(200).json({ message: "Course dropped" });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

module.exports = {
  getCourses,
  teachCourse,
  // leaveCourse,
  getAllStudents,
};
