const mongoose=require("mongoose");

const subTaskSchema = new mongoose.Schema({
  id:{ 
    type: Number, 
    trim: true 
  },
    
    title: {
      type: String,
      trim: true
  },
    description: {
      type: String,
      trim: true
  },
    task_id: { 
      type: mongoose.Schema.Types.ObjectId, ref: 'Task' 
    },
    status: { 
      type: Number, 
      enum: [0, 1], 
      default: 0 
    },
    created_at: { 
      type: Date, 
      default: Date.now 
    },
    updated_at: Date,
    deleted_at: Date,
    isDeleted: {
      type: Boolean, 
      default: false
  }
  });
  
  const SubTask = mongoose.model('SubTask', subTaskSchema);
  module.exports=SubTask;