const mongoose=require("mongoose");
const taskModel=require("../models/taskModel");
const userModel=require("../models/userModel")
const middleware=require('../middleware/middleware');
const subtaskModel= require('../models/subtaskModel')
const {isValidString, isValidDate, isValidId,isValidName, isValidObjectId,isValidStatus,isValidSuvTaskStatus}=require("../validation/validation");


const creatsubTask = async function (request, response) {
    try {
        let data = request.body;
        const { id, title, description, task_id, status, isDeleted } = data;

        // Request body is empty
        if (Object.keys(data).length == 0) return response.status(400).send({ status: false, message: "Request body is empty" });

        if (!title) return response.status(400).send({ status: false, message: "Please provide title" });
        // Validation
        if (!isValidString(title) && !isValidName(title)) return response.status(400).send({ status: false, message: "Please provide valid title" });

        if (!description) return response.status(400).send({ status: false, message: "Please provide description" });
        // Validation
        if (!isValidString(description) && !isValidName(description)) return response.status(400).send({ status: false, message: "Please provide valid description" });

        if (!task_id) return response.status(400).send({ status: false, message: "Please provide task_id" });
        // Validation
        if (!isValidObjectId(task_id)) return response.status(400).send({ status: false, message: "Please provide valid task_id" });

        if (status === undefined || status === null) {
            return response.status(400).send({ status: false, message: "Please provide status" });
        }

        // Parse status as a number
        const parsedStatus = parseInt(status, 10);

        // Validation
        if (parsedStatus !== 0 && parsedStatus !== 1) {
            return response.status(400).send({ status: false, message: "Please provide valid status" });
        }

        // Assign the parsed status to the data
        data.status = parsedStatus;

        let checktaskId = await taskModel.findOne({ _id: task_id, isDeleted: false });
        if (!checktaskId) return res.status(404).send({ status: false, message: "book does not exist" }); 

        //--------------------------update review----------------------------

        let subtask = checktaskId.subtask;
        await taskModel.findByIdAndUpdate(
                { _id: task_id },
                { $inc: { subtask: 1 } }, 
                { new: true }
            );
    

        const CreatedTask = await subtaskModel.create(data);

        return response.status(201).json({ success: true, CreatedTask });

    } catch (error) {
        return response.status(500).send({ status: false, message: error.message });
    }
};

const getAlluserTaks= async function(request, response){
    try{     
        const data=request.query;
        
        const{task_id}=data;
        if(Object.keys(data).length ==0) return res.status(400).send({status:false, message: "provide required information in query"})

        const filter= {};
        if(task_id){
            filter.task_id=task_id;
        }


        const getsubtask= await subtaskModel.find(filter).select({_id:1,title:1,description:1, task_id:1 , status:1})

        response.json(getsubtask);


    }catch(error){
        return response.status(500).send({status:false,message:error.message});
    }
}

const updateSubTask = async function(request, response) {
    try {
        const subtaskId = request.params.subtaskId;

        if (subtaskId) {
            if (!isValidObjectId(subtaskId)) {
                return response.status(400).send({ status: false, message: "taskId is not a valid Mongoose ObjectId." });
            }
        }

        const subtaskFound = await subtaskModel.findOne({ _id: subtaskId });

        if (!subtaskFound) {
            return response.status(404).send({ status: false, message: `No Subtask found with taskId: ${subtaskIdtaskId}.` });
        }

        let data = request.body;
        const {  status } = data;
        if (Object.keys(data).length == 0) return response.status(400).send({ status: false, message: "Request body is empty" });

        const findSubTaskIfNotDeleted = await subtaskModel.findOne({ _id: subtaskId, isDeleted: false });
        if (!findSubTaskIfNotDeleted) return response.status(404).send({ status: false, message: "Subtask is already deleted." });
        
        const updateFields = {};
        

        if (status !== undefined) {
            if (![0, 1].includes(status)) {
                return response.status(400).send({ status: false, message: "Invalid status value. Should be 0 or 1." });
            }
            updateFields.status = status;
        }

        const findAndUpdateSubTask = await subtaskModel.findByIdAndUpdate(
            { _id: subtaskId },
            { $set: updateFields },
            { new: true }
        );

        return response.status(200).send({ status: true, message: findAndUpdateSubTask });
    } catch (error) {
        return response.status(500).send({ status: false, message: error.message });
    }
};

const deleteSubTask = async function(request, response){
    try{
        const taskId=request.params.taskId

        if (taskId) if (!isValidObjectId(taskId)) return res.status(400).send({ status: false, message: "taskId NOT a Valid Mongoose ObjectId."});
            
       const taskFound = await taskModel.findOne({ _id: taskId});
      
       if (!taskFound) return response.status(404).send({status: false, message: `NO Books Found having <bookId: ${taskId}>.`, });

       const findTaskIfNotDeleted= await taskModel.findOne({isDeleted:false});
       if(!findTaskIfNotDeleted) return response.status(404).send({status:false, message: "Task is already deleted"});
        
        const subtaskId = request.params.subtaskId;

        if (subtaskId) {
            if (!isValidObjectId(subtaskId)) {
                return response.status(400).send({ status: false, message: "taskId is not a valid Mongoose ObjectId." });
            }
        }

        const subtaskFound = await subtaskModel.findOne({ _id: subtaskId });

        if (!subtaskFound) {
            return response.status(404).send({ status: false, message: `No Subtask found with taskId: ${subtaskIdtaskId}.` });
        }

        const findSubTaskIfNotDeleted = await subtaskModel.findOne({ _id: subtaskId, isDeleted: false });
        if (!findSubTaskIfNotDeleted) return response.status(404).send({ status: false, message: "Subtask is already deleted." });
               

       let findAndDeleteSubTask = await subtaskModel.findByIdAndUpdate(
           {_id:subtaskId,isDeleted:false},
          {$set:{
           isDeleted:true
          }},
          {new:true} )

          if(findAndDeleteSubTask){
        await taskModel.findByIdAndUpdate(
                {_id:taskId},{$inc: { subtask: -1 }}, {new:true} )
        }

          return response.status(200).send({ status: true, message: findAndDeleteSubTask, message: "Subtask is deleted sucessfully" });

    }
    catch(error){
        return response.status(500).send({ status: false, message: error.message }) 
    }
}



module.exports={creatsubTask,getAlluserTaks, updateSubTask, deleteSubTask};