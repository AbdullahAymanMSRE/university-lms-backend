const {
  uploadFile,
  getFile,
  deleteFile,
} = require("../../services/cloudinary");
const connection = require("../../utils/db");
const CreateWeek = async (req, res) => {
  try {
    const { courseId } = req.params;
    const instructor_id = req.user;
    const { name } = req.body;
    const query1 = `SELECT * FROM teaches WHERE course_id = ? AND instructor_id = ?`;
    const values1 = [courseId, instructor_id];
    const [result1] = await connection.query(query1, values1);
    if (result1.length === 0) {
      throw new Error("You are not teaching this course");
    }
    const query = `INSERT INTO weeks (name, course_id, instructor_id) VALUES (?, ?, ?)`;
    const values = [name, courseId, instructor_id];
    const [result] = await connection.query(query, values);
    console.log();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
const uploadWeekFile = async (req, res) => {
  try {
    const { courseId, weekId } = req.params;
    const instructor_id = req.user;
    const query1 = `SELECT * FROM weeks WHERE id AND course_id = ? AND instructor_id = ?`;
    const [result1] = await connection.query(query1, [courseId, instructor_id]);
    if (result1.length === 0) {
      throw new Error("You are Not teaching this course");
    }
    const query4 = `SELECT instructor_id FROM weeks WHERE id = ?`;
    const [result4] = await connection.query(query4, weekId);
    if (result4[0].instructor_id !== instructor_id) {
      throw new Error("No week exists");
    }
    const upload = await uploadFile(req.file.path);
    const query = `INSERT INTO week_files (id, path, week_id) VALUES (?, ?, ?)`;
    const values = [upload.public_id, upload.url, weekId];
    const [result] = await connection.query(query, values);
    res.status(200).json({ success: true, data: upload });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getWeeks = async (req, res) => {
  try {
    const { courseId } = req.params;
    const instructor_id = req.user;
    const query1 = `SELECT * FROM teaches WHERE course_id = ? AND instructor_id = ?`;
    const values1 = [courseId, instructor_id];
    const [result1] = await connection.query(query1, values1);
    if (result1.length === 0) {
      throw new Error("You are not teaching this course");
    }
    const query = `SELECT * FROM weeks WHERE course_id = ? AND instructor_id = ?`;
    const [result] = await connection.query(query, [courseId, instructor_id]);
    const query2 = `SELECT * FROM week_files WHERE week_id = ?`;
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

const deleteWeek = async (req, res) => {
  try {
    const { weekId } = req.params;
    const query1 = `SELECT * FROM weeks WHERE id = ?`;
    const [result1] = await connection.query(query1, [weekId]);
    if (result1.length === 0) {
      throw new Error("No week exists with this id");
    }
    const query3 = `SELECT * FROM week_files WHERE week_id = ?`;
    const [result3] = await connection.query(query3, [weekId]);
    for (let i = 0; i < result3.length; i++) {
      await deleteFile(result3[i].id);
    }
    const query2 = `DELETE FROM week_files WHERE week_id = ?`;
    const [result2] = await connection.query(query2, [weekId]);
    const query = `DELETE FROM weeks WHERE id = ?`;
    const [result] = await connection.query(query, [weekId]);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWeeks,
  CreateWeek,
  uploadWeekFile,
  deleteWeek,
};

// const connection = require("../../utils/db");
// const getWeeks = async (req, res) => {
//   try {
//     const [weeks] = await pool.query(`
//             SELECT w.id AS week_id, w.name AS week_name, w.course_id,
//                    f.id AS file_id, f.path AS file_path
//             FROM weeks w
//             LEFT JOIN files f ON w.id = f.weeks_id
//             ORDER BY w.id;
//         `);
//     const weeksMap = {};
//     weeks.forEach((row) => {
//       if (!weeksMap[row.week_id]) {
//         weeksMap[row.week_id] = {
//           id: row.week_id,
//           name: row.week_name,
//           course_id: row.course_id,
//           files: [],
//         };
//       }
//       if (row.file_id) {
//         weeksMap[row.week_id].files.push({
//           id: row.file_id,
//           path: row.file_path,
//         });
//       }
//     });
//     const result = Object.values(weeksMap);
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ error: "An error occurred while fetching weeks." });
//   }
// };
// const createWeek = async (req, res) => {
//   const courseId = req.params.id;
//   const { name } = req.body;
//   try {
//     const [rows] = await connection.query(
//       `SELECT * FROM weeks WHERE name = ?`,
//       [name]
//     );
//     if (rows.length > 0) {
//       throw new Error("Week name already exists");
//     }
//     const query = `insert into weeks (name, course_id) values (?, ?)`;
//     const [result] = await connection.query(query, [name, courseId]);
//     const id = result.insertId;
//     res.status(200).json({ id, name, courseId });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const uploadWeekFile = async (req, res) => {
//   const courseId = req.params.id;
//   const { title, content } = req.body;
//   try {
//     const query = `insert into weeks (title, content, course_id) values (?, ?, ?)`;
//     await connection.query(query, [title, content, courseId]);
//     res.status(200).json({ message: "Week created" });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// module.exports = { getWeeks, createWeek, uploadWeekFile };
