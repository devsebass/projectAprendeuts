const mentoringController = require("../controllers/mentoringController");
const express = require("express");
const router = express.Router();

//Mentoring's routes
router.get("/student/mentoring", mentoringController.createMentoring);
router.post("/student/mentoring", mentoringController.insertMentoring);
router.get("/student/mentoring/list", mentoringController.listMentoring);
router.post("/student/mentoring/list", mentoringController.saveRating);

router.get("/teacher/mentoring/list", mentoringController.listMentoringTeacher);
router.get(
  "/teacher/mentoring/delete/:id",
  mentoringController.deleteMentoringTeacher
);

module.exports = router;
