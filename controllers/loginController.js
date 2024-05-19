const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const connection = require("../utils/db");

const signup = async (req, res) => {
  try {
    const { role, id, name, email, faculty, password } = req.body;
    if (role !== "student" && role !== "instructor") {
      throw new Error("Role must be student or instructor");
    }
    if (!id || !name || !email || !faculty || !password) {
      throw new Error("All fields are required");
    }
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email");
    }
    if (!validator.isStrongPassword(password)) {
      throw new Error("Password is not strong enough");
    }
    const studentEmailExist = await connection
      .promise()
      .query("SELECT email FROM student where email = ?", [email]);
    const instructorEmailExist = await connection
      .promise()
      .query("SELECT email FROM instructor where email = ?", [email]);
    if (role == "student") {
      const studentIDExist = await connection
        .promise()
        .query("SELECT id FROM student where id = ?", [id]);
      if (studentIDExist[0].length > 0) {
        throw new Error("User already exists");
      }
      if (
        studentEmailExist[0].length > 0 ||
        instructorEmailExist[0].length > 0
      ) {
        throw new Error("Email already exists");
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const query = `INSERT INTO student
                 (id, name, email, faculty, password) VALUES
                (?, ?, ?, ?, ?)`;
      connection.query(query, [id, name, email, faculty, hash]);
      const token = await jwt.sign({ id }, process.env.SECRET, {
        expiresIn: "3d",
      });
      res.status(200).json({ id, email, token });
    } else if (role == "instructor") {
      const instructorIDExist = await connection
        .promise()
        .query("SELECT id FROM instructor where id = ?", [id]);
      if (instructorIDExist[0].length > 0) {
        throw new Error("User already exists");
      }
      if (
        instructorEmailExist[0].length > 0 ||
        studentEmailExist[0].length > 0
      ) {
        throw new Error("Email already exists");
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const query = `INSERT INTO instructor
                       (id, name, email, faculty, password) VALUES
                      (?, ?, ?, ?, ?)`;
      connection.query(query, [id, name, email, faculty, hash]);
      const token = await jwt.sign({ id }, process.env.SECRET, {
        expiresIn: "3d",
      });
      res.status(200).json({ id, email, token });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email && !password) {
      throw new Error("All fields are required");
    }
    const [existStudent] = await connection
      .promise()
      .query("SELECT * FROM student WHERE email = ?", [email]);
    const [existInstructor] = await connection
      .promise()
      .query("SELECT * FROM instructor WHERE email = ?", [email]);
    if (!existStudent && !existInstructor) {
      throw new Error("Incorrect email");
    }
    if (existStudent) {
      if (!(await bcrypt.compare(password, existStudent[0].password))) {
        throw new Error("Incorrect password");
      }
      const id = existStudent[0].id;
      const token = await jwt.sign({ id }, process.env.SECRET, {
        expiresIn: "3d",
      });
      res.status(200).json({ id: existStudent[0].id, email, token });
    }
    if (existInstructor) {
      if (!(await bcrypt.compare(password, existInstructor[0].password))) {
        throw new Error("Incorrect password");
      }
      const id = existInstructor[0].id;
      const token = await jwt.sign({ id }, process.env.SECRET, {
        expiresIn: "3d",
      });
      res.status(200).json({ id: existInstructor[0].id, email, token });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { login, signup };
