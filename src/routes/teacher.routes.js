const loginControllerTeacher = require("../controllers/loginControllerTeacher");
const teacherController = require("../controllers/teacherController");
const express = require("express");
const router = express.Router();

//Teacher's routes
router.get("/teacher/login", loginControllerTeacher.login);
router.post("/teacher/login", loginControllerTeacher.auth);
router.get("/teacher/logout", loginControllerTeacher.logout);

router.get("/teacher/home", teacherController.home);
router.get("/teacher/data", teacherController.data);
router.post("/teacher/data", teacherController.updatePassword);
router.get("/teacher/rating", teacherController.rating);

module.exports = router;
