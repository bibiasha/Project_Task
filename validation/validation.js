const mongoose = require('mongoose');

const isValidPriority = function (value) {
    return [0, 1, 2].indexOf(value) !== -1;
  };
  
  const isValidPhone = function (phone) {
    return /^[0]?[789]\d{9}$/.test(phone);
  };

  const isValidObjectId = function (value) {
    return mongoose.Types.ObjectId.isValid(value);
  };
  
  const isValidId = function (id) {
    return typeof id === 'number' && id > 0;
  };

  const isValidPassword = function (password) {
    return (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password))
}

const isValidString = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidName = function (value) {
  if (/^[a-zA-Z, ]+$/.test(value)) {
    return true;
  }
};

//date(format:mm/dd/yyyy)
const isValidDate= function(Date){
  if (/^(?:(?:(?:0?[13578]|1[02])(\/|-|\.)31)\1|(?:(?:0?[1,3-9]|1[0-2])(\/|-|\.)(?:29|30)\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:0?2(\/|-|\.)29\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:(?:0?[1-9])|(?:1[0-2]))(\/|-|\.)(?:0?[1-9]|1\d|2[0-8])\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(Date)){
    return true;
  }
} 

const isValidStatus = function (value) {
  return ["TODO", "DONE"].indexOf(value) !== -1;
};

const isValidSuvTaskStatus = function (value) {
  return ["0","1"].indexOf(value) !== -1;
};



module.exports={isValidPriority, isValidSuvTaskStatus, isValidPhone, isValidId, isValidPassword, isValidString, isValidDate,isValidName, isValidObjectId, isValidStatus};
