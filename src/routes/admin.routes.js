const express = require("express");
const loginControllerAdmin = require("../controllers/loginControllerAdmin");
const adminController = require("../controllers/adminController");
const router = express.Router();

//Admin's routes
router.get("/student/login", loginControllerAdmin.login);
router.post("/admin/login", loginControllerAdmin.auth);
router.get("/admin/register", loginControllerAdmin.register);
router.post("/admin/register", loginControllerAdmin.user);
router.get("/admin/logout", loginControllerAdmin.logout);
router.get("/admin/resetPassword", loginControllerAdmin.formResetPassword);
router.post("/admin/resetPassword", loginControllerAdmin.sentToken);
router.get("/admin/resetPassword/:Token", loginControllerAdmin.validationToken);
router.post("/admin/resetPassword/:Token", loginControllerAdmin.updatePassword);

router.get("/admin/home", adminController.home);

router.get("/admin/student/list", adminController.studentList);
router.get("/admin/student/edit/:id", adminController.studentEdit);
router.post("/admin/student/edit/:id", adminController.studentEditSave);
router.get("/admin/student/delete/:id", adminController.studentDelete);

router.get("/admin/mentoring/list", adminController.mentoringList);
router.get("/admin/mentoring/edit/:id", adminController.mentoringEdit);
router.post("/admin/mentoring/edit/:id", adminController.mentoringEditSave);
router.get("/admin/mentoring/delete/:id", adminController.mentoringDelete);

router.get("/admin/teacher/list", adminController.teacherList);
router.get("/admin/teacher/new", adminController.teacherNew);
router.post(
  "/admin/teacher/new",
  adminController.uploadImage,
  adminController.teacherCreate
);
router.get("/admin/teacher/edit/:id", adminController.teacherEdit);
router.post("/admin/teacher/edit/:id", adminController.teacherEditSave);
router.get("/admin/teacher/delete/:id", adminController.teacherDelete);

router.get("/admin/subject/list", adminController.subjectList);
router.get("/admin/subject/new", adminController.subjectNew);
router.post("/admin/subject/new", adminController.subjectCreate);
router.get("/admin/subject/edit/:id", adminController.subjectEdit);
router.post("/admin/subject/edit/:id", adminController.subjectEditSave);
router.get("/admin/subject/delete/:id", adminController.subjectDelete);

router.get("/admin/rating/list", adminController.ratingList);
router.get("/admin/rating/delete/:id", adminController.ratingDelete);

router.get("/admin/data", adminController.adminData);
router.post("/admin/data/:id", adminController.adminDataSave);

module.exports = router;
