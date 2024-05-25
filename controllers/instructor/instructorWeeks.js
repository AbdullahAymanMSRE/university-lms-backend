const connection = require("../../utils/db");
const getWeeks = async (req, res) => {
  try {
    const [weeks] = await pool.query(`
            SELECT w.id AS week_id, w.name AS week_name, w.course_id, 
                   f.id AS file_id, f.path AS file_path
            FROM weeks w
            LEFT JOIN files f ON w.id = f.weeks_id
            ORDER BY w.id;
        `);
    const weeksMap = {};
    weeks.forEach((row) => {
      if (!weeksMap[row.week_id]) {
        weeksMap[row.week_id] = {
          id: row.week_id,
          name: row.week_name,
          course_id: row.course_id,
          files: [],
        };
      }
      if (row.file_id) {
        weeksMap[row.week_id].files.push({
          id: row.file_id,
          path: row.file_path,
        });
      }
    });
    const result = Object.values(weeksMap);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching weeks." });
  }
};
const createWeek = async (req, res) => {
  const courseId = req.params.id;
  const { name } = req.body;
  try {
    const [rows] = await connection.query(
      `SELECT * FROM weeks WHERE name = ?`,
      [name]
    );
    if (rows.length > 0) {
      throw new Error("Week name already exists");
    }
    const query = `insert into weeks (name, course_id) values (?, ?)`;
    const [result] = await connection.query(query, [name, courseId]);
    const id = result.insertId;
    res.status(200).json({ id, name, courseId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addWeekFile = async (req, res) => {
  const courseId = req.params.id;
  const { title, content } = req.body;
  try {
    const query = `insert into weeks (title, content, course_id) values (?, ?, ?)`;
    await connection.query(query, [title, content, courseId]);
    res.status(200).json({ message: "Week created" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getWeeks, createWeek, addWeekFile };
