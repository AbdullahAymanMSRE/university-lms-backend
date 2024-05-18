/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login endpoint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid request or credentials
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Signup endpoint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               level:
 *                 type: string
 *               faculty:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful signup
 *       400:
 *         description: Invalid request or user already exists
 */

const express = require("express");
const { login, signup } = require("../controllers/studentLogin");
const studentAuth = require("../middleware/studentAuth");
const {
  getCourses,
  registerCourse,
  dropCourse,
} = require("../controllers/studentCourses");

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);

router.use(studentAuth);

const coursesRouter = express.Router();
router.use("/courses", coursesRouter);
coursesRouter.get("/", getCourses);
coursesRouter.post("/:id", registerCourse);
coursesRouter.delete("/:id", dropCourse);

module.exports = router;
