const router=require('express').Router();
const quizController=require("../controllers/quiz.controller");
//la liste des questions dans la base de donnees.
router.get("/categories",quizController.getCategories);
router.get("/questions",quizController.getQuestions);
router.get("/questionsOf/:idCategory",quizController.getQuestionsOf);
router.post("/addCategory",quizController.addCategory);
router.post("/addQuestionIn/:name",quizController.addQuestion);



module.exports=router;