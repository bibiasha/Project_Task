const express = require('express');
const router = express.Router();
const userController= require('../controller/userController');
const taskController= require('../controller/taskController');
const subtaskController= require('../controller/subtaskController');
const middleware=require('../middleware/middleware');


//user

router.post('/register',  userController.createUser);

router.post("/login",userController.login);

//Task

router.post("/task", middleware.authentication, taskController.creatTask);
router.get("/getTask", middleware.authentication, taskController.getAlluserTaks);
router.put("/updateTask/:taskId", middleware.authentication, taskController.updateTask);
router.delete("/deleteTask/:taskId", middleware.authentication, taskController.deleteTask);

//Subtask

router.post("/subtask", subtaskController.creatsubTask);
router.get("/getSubtask", subtaskController.getAlluserTaks);
router.put("/updateSubtask/:subtaskId", subtaskController.updateSubTask);
router.delete("/deleteTask/:taskId/deleteSubtask/:subtaskId", subtaskController.deleteSubTask);




module.exports = router;