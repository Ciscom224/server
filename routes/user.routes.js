const router=require('express').Router();
const authController=require('../controllers/auth.controller');
const userController=require('../controllers/user.controller');
const uploadController=require('../controllers/uploadController');

// Routes pour l'authentification des utilisateurs
router.post('/add',authController.signUp);
router.post('/login',authController.signIn);
router.get('/logout',authController.logout);

//autres routes pour utilisateurs

router.get('/all',userController.getUsers);
router.get('/:id',userController.user);
router.delete('/delete/:id',userController.deleteUser);
router.put('/update/:id',userController.updateUser);

// classement des joueurs

router.get("/getBestPayers",userController.getBestPayers);

// gestion d'image 

router.post("/uploadImage/:id", uploadController.uploadProfil);
// gestion d'amis
router.patch('/addFriend/:id',userController.addFriend);
router.patch('/delFriend/:id',userController.delFriend);
// Gestion de score
router.patch('/updateScore/:id',userController.updateScore);

// Gestion de messagerie
router.patch("/sendMessageTo/:id",userController.sendMessage);
router.patch("/updateMessage/:id",userController.updateMessage);
router.patch("/removeMessage/:id",userController.removeMessage);


module.exports=router;