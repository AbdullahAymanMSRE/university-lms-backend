const jwt = require("jsonwebtoken");
const connection = require("../utils/db");
const studentAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  const token = authorization.split(" ")[1];
  try {
    const { id } = jwt.verify(token, process.env.SECRET);
    const query = `select * from student where id = ?`;
    const [user] = await connection.promise().query(query, [id]);
    if (user.length === 0) {
      throw new Error("Request is not authorized");
    }
    req.user = user[0].id;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
module.exports = studentAuth;
