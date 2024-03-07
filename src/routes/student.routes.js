const express = require("express");
const loginControllerStudent = require("../controllers/loginControllerStudent");
const studentController = require("../controllers/studentController");
const router = express.Router();

//Student's routes
router.get("/student/login", loginControllerStudent.login);
router.post("/student/login", loginControllerStudent.auth);
router.get("/student/register", loginControllerStudent.register);
router.post("/student/register", loginControllerStudent.user);
router.get("/student/logout", loginControllerStudent.logout);
router.get("/student/resetPassword", loginControllerStudent.formResetPassword);
router.post("/student/resetPassword", loginControllerStudent.sentToken);
router.get(
  "/student/resetPassword/:Token",
  loginControllerStudent.validationToken
);
router.post(
  "/student/resetPassword/:Token",
  loginControllerStudent.updatePassword
);
router.get("/student/home", studentController.home);
router.get("/student/data", studentController.data);
router.post("/student/data", studentController.updatePassword);

module.exports = router;
