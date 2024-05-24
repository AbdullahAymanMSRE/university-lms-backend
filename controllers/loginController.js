const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const connection = require("../utils/db");

const signup = async (req, res) => {
  try {
    const { role, name, email, faculty, password } = req.body;
    if (role !== "student" && role !== "instructor") {
      throw new Error("Role must be student or instructor");
    }
    if (!name || !email || !faculty || !password) {
      throw new Error("All fields are required");
    }
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email");
    }
    const studentEmailExist = await connection.query(
      "SELECT email FROM student where email = ?",
      [email]
    );
    const instructorEmailExist = await connection.query(
      "SELECT email FROM instructor where email = ?",
      [email]
    );
    if (role == "student") {
      if (
        studentEmailExist[0].length > 0 ||
        instructorEmailExist[0].length > 0
      ) {
        throw new Error("Email already exists");
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const query = `INSERT INTO student
                       (name, email, faculty, password) VALUES
                      (?, ?, ?, ?)`;
      connection.query(query, [name, email, faculty, hash]);
      const [id] = await connection.query(
        "SELECT id FROM student WHERE email = ?",
        [email]
      );
      const token = await jwt.sign({ id }, process.env.SECRET, {
        expiresIn: "3d",
      });
      res.status(200).json({ id: id[0].id, name, email, faculty, token });
    } else if (role == "instructor") {
      if (
        instructorEmailExist[0].length > 0 ||
        studentEmailExist[0].length > 0
      ) {
        throw new Error("Email already exists");
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const query = `INSERT INTO instructor
                       (name, email, faculty, password) VALUES
                      (?, ?, ?, ?)`;
      connection.query(query, [name, email, faculty, hash]);
      const [id] = await connection.query(
        "SELECT id FROM instructor WHERE email = ?",
        [email]
      );
      const token = await jwt.sign({ id }, process.env.SECRET, {
        expiresIn: "3d",
      });
      res.status(200).json({ id: id[0].id, name, email, faculty, token });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      throw new Error("All fields are required");
    }
    const [existStudent] = await connection.query(
      "SELECT * FROM student WHERE email = ?",
      [email]
    );
    const [existInstructor] = await connection.query(
      "SELECT * FROM instructor WHERE email = ?",
      [email]
    );
    if (!existStudent && !existInstructor) {
      throw new Error("Incorrect email");
    }
    if (existStudent) {
      if (!(await bcrypt.compare(password, existStudent[0].password))) {
        throw new Error("Incorrect password");
      }
      const { id, name, email, faculty } = existStudent[0];
      const token = await jwt.sign({ id }, process.env.SECRET, {
        expiresIn: "3d",
      });
      res.status(200).json({ id, name, email, faculty, token });
    } else if (existInstructor) {
      if (!(await bcrypt.compare(password, existInstructor[0].password))) {
        throw new Error("Incorrect password");
      }
      const { id, name, email, faculty } = existInstructor[0];
      const token = await jwt.sign({ id }, process.env.SECRET, {
        expiresIn: "3d",
      });
      res.status(200).json({ id, name, email, faculty, token });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { login, signup };
