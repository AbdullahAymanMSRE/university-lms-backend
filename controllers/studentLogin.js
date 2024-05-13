const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const connection = require("../utils/db");

const signup = async (req, res) => {
  try {
    const { id, name, email, level, faculty, password } = req.body;
    if (!id || !name || !email || !level || !faculty || !password) {
      throw new Error("All fields are required");
    }
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email");
    }
    if (!validator.isStrongPassword(password)) {
      throw new Error("Password is not strong enough");
    }
    const exist = await connection
      .promise()
      .query("SELECT id FROM student where id = ?", [id]);
    if (exist[0].length > 0) {
      throw new Error("User already exists");
    }
    const emailExist = await connection
      .promise()
      .query("SELECT email FROM student where email = ?", [email]);
    if (emailExist[0].length > 0) {
      throw new Error("Email already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const query = `INSERT INTO student
                 (id, name, email, level, faculty, password) VALUES
                (?, ?, ?, ?, ?, ?)`;
    connection.query(query, [id, name, email, level, faculty, hash]);
    const token = await jwt.sign({ id }, process.env.SECRET, {
      expiresIn: "3d",
    });
    res.status(200).json({ id, email, token });
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
    const [user] = await connection
      .promise()
      .query("SELECT * FROM student WHERE email = ?", [email]);
    if (!user) {
      throw new Error("Incorrect email");
    }
    if (!(await bcrypt.compare(password, user[0].password))) {
      throw new Error("Incorrect email or password");
    }
    const id = user[0].id;
    const token = await jwt.sign({ id }, process.env.SECRET, {
      expiresIn: "3d",
    });
    res.status(200).json({ id: user[0].id, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { login, signup };
