const mongoose=require("mongoose");
const taskModel=require("../models/taskModel");
const userModel=require("../models/userModel")
const {isValidString, isValidDate, isValidId,isValidName, isValidObjectId,isValidStatus}=require("../validation/validation");
const middleware=require('../middleware/middleware');


const creatTask= async function(request, response){
    try{
        let data=request.body;
        const {id, title, description, due_date, priority, status, isDeleted, subtask}=data;

        //Request body is empty
        if(Object.keys(data).length==0) return response.status(400).send({status:false,message:"request bosy is empty"});

        if(!title) return response.status(400).send({status:false,message:"Please provide title"});
        //validation
        if(!isValidString(title) && !isValidName(title)) return response.status(400).send({status:false,message:"Please provide valid title"});

        if(!description) return response.status(400).send({status:false,message:"Please provide description"});
        //validation
        if(!isValidString(description) && !isValidName(description)) return response.status(400).send({status:false,message:"Please provide valid description"});

        if(!due_date) return response.status(400).send({status:false,message:"Please provide due_date"});
        //validation
        if(!isValidDate(due_date)) return response.status(400).send({status:false,message:"Please provide valid due_date"});

      //  if(!priority) return response.status(400).send({status:false,message:"Please provide priority"});
        //validation
       if(!isValidId(priority)) return response.status(400).send({status:false,message:"Please provide valid id"});

        const CreatedTask= await taskModel.create({title, description, due_date, priority, status, isDeleted, subtask});

        return response.status(201).json({success:true, CreatedTask});

    }catch(error){
        return response.status(500).send({status:false,message:error.message});
    }
}


const getAlluserTaks= async function(request, response){
    try{     
        const data=request.query;
        
        const{priority, due_date, page = 1, pageSize = 10}=data;
        if(Object.keys(data).length ==0) return res.status(400).send({status:false, message: "provide required information in query"})

        const filter= {};
        if(priority){
            filter.priority=priority;
        }

        if(due_date){
            filter.due_date= { $lte: new Date(due_date) };
        }

        const pagination= await taskModel.find(filter).select({_id:1,title:1,description:1, due_date:1, priority:1, subtask:1})
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate('subtask')
        .exec();

        response.json(pagination);


    }catch(error){
        return response.status(500).send({status:false,message:error.message});
    }
}

const updateTask = async function(request, response) {
    try {
        const taskId = request.params.taskId;

        if (taskId) {
            if (!isValidObjectId(taskId)) {
                return response.status(400).send({ status: false, message: "taskId is not a valid Mongoose ObjectId." });
            }
        }

        const taskFound = await taskModel.findOne({ _id: taskId });

        if (!taskFound) {
            return response.status(404).send({ status: false, message: `No task found with taskId: ${taskId}.` });
        }

        let data = request.body;
        const { due_date, status } = data;

        if (!due_date && !status) {
            return response.status(400).send({ status: false, message: "Provide either due_date or status to update." });
        }

        const findTaskIfNotDeleted = await taskModel.findOne({ _id: taskId, isDeleted: false });
        if (!findTaskIfNotDeleted) {
            return response.status(404).send({ status: false, message: "Task is already deleted." });
        }
        try {
           
            const overdueTasks = await taskModel.find({ isDeleted: false, due_date: { $lte: new Date() } });

            const updatedTasks = await Promise.all(
                overdueTasks.map(async (task) => {
                    task.priority = task.priority - 1;
                    return await task.save();
                })
            );

            console.log(`Updated ${updatedTasks.length} tasks based on due_date.`);
        } catch (error) {
            console.error('Error updating task priorities:', error.message);
        }

        const updateFields = {};
        
        if (due_date) {
            // Assuming isValidDate checks the format and validity of the date
            if (!isValidDate(due_date)) {
                return response.status(400).send({ status: false, message: "Invalid due_date format or value." });
            }
            updateFields.due_date = new Date(due_date);;
        }

        if (status) {
            // Assuming isValidStatus checks the validity of the status
            if (!isValidStatus(status)) {
                return response.status(400).send({ status: false, message: "Invalid status value." });
            }
            updateFields.status = status;
        }

        const findAndUpdateTask = await taskModel.findByIdAndUpdate(
            { _id: taskId },
            { $set: updateFields },
            { new: true }
        );

        return response.status(200).send({ status: true, message: findAndUpdateTask });
    } catch (error) {
        return response.status(500).send({ status: false, message: error.message });
    }
};


const deleteTask = async function(request, response){
    try{
        const taskId=request.params.taskId

        if (taskId) {
            if (!isValidObjectId(taskId)) return res.status(400).send({ status: false, message: "taskId NOT a Valid Mongoose ObjectId."});
            }
      
            const taskFound = await taskModel.findOne({ _id: taskId});
      
            
            if (!taskFound) return response.status(404).send({status: false, message: `NO Books Found having <bookId: ${taskId}>.`, });

       
       const findTaskIfNotDeleted= await taskModel.findOne({isDeleted:false});
        if(!findTaskIfNotDeleted) return response.status(404).send({status:false, message: "Task is already deleted"});

       let findAndDeleteTask = await taskModel.findByIdAndUpdate(
           {_id:taskId,isDeleted:false},
          {$set:{
           isDeleted:true
          }},
          {new:true} )

          return response.status(200).send({ status: true, message: findAndDeleteTask, message: "Task is deleted sucessfully" });

    }
    catch(error){
        return response.status(500).send({ status: false, message: error.message }) 
    }
}



module.exports={creatTask,getAlluserTaks, updateTask, deleteTask};
