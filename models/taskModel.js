const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
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
  due_date: Date,
  priority: {
    type:Number,
    enum:[0,1,2],
    trim: true
},
subtask:{
  type: Number,
  default:0
},
  status: { 
    type: String, 
    enum: ['TODO', 'DONE'], default: 'TODO' 
  },
  deleted_at: Date,
  isDeleted: {
    type: Boolean, 
    default: false
}
});

const Task = mongoose.model('Task', taskSchema);

module.exports=Task;