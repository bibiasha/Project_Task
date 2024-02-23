const userModel=require("../models/userModel");
const jwt=require("jsonwebtoken");
const {isValidId,isValidPhone,isValidPriority,isValidPassword}=require("../validation/validation");
const { response } = require("express");


const createUser= async function(request, response){
    try{
        let data=request.body;
        const {id,phone_number,priority,password,isDeleted}=data;

        //Request body is empty
        if(Object.keys(data).length==0) return response.status(400).send({status:false,message:"request bosy is empty"});

        //validation
        if(!isValidId(id)) return response.status(400).send({status:false,message:"Please provide valid id"});

        if(!phone_number) return response.status(400).send({status:false,message:"Please provide phone number"});
        //validation
        if(!isValidPhone(phone_number)) return response.status(400).send({status:false,message:"Please provide valid phone number"});

        if(!priority) return response.status(400).send({status:false,message:"Please provide priority"});
        //validation
        if(!isValidPriority(priority)) return response.status(400).send({status:false,message:"Please provide valid priority"});

        if(!password) return response.status(400).send({status:false,message:"Please provide password"});
        //validation
        //if(!isValidPassword(password)) return response.status(400).send({status:false,message:"Please provide valid password"});
        
        //unique id
        const uniqueId= await userModel.findOne({id:id});
        if(uniqueId) return response.status(404).send({status:false,message:"id already exist"});

        //unique phone number
        const uniquePhone= await userModel.findOne({phone_number:phone_number});
        if(uniquePhone) return response.status(404).send({status:false,message:"Phone number already exist"});

        const User= await userModel.create({id,phone_number,priority,password, isDeleted});

        return response.status(201).json({success:true, User});

    }catch(error){
        return response.status(500).send({status:false,message:error.message});
    }
}

const login= async function(request, response){
    try{
        const id1=request.body.id;
        const  password1=request.body.password;

        if(!id1) return response.status(400).send({status:false,message:"Please provide id"});
        if(!password1) return response.status(400).send({status:false,message:"Please provide password"});
    
        // const loginById= await userModel.findOne({id:id1});
        // if(!loginById) return response.status(400).send({status:false, message:"id is incorrect"});

        // const loginByIdAndPassword= await userModel.findOne({password:password1});
        // if(!loginByIdAndPassword) return response.status(400).send({status:false, message:"password is incorrect"});

        const user = await userModel.findOne({ id: id1, password: password1 });

    if (!user) {
      return response.status(400).send({ status: false, message: "id or password is incorrect" });
    }

        const token=jwt.sign({
            id:user.id,
            password:user.password
        },
        "asha"
        );

        response.setHeader("api-key", token);
        response.status(200).send({status:true, message: "Token Generated Successfully.", data: token})


    }catch(error){
        return response.status(500).send({status:false, message:error.message});
    }
}

module.exports={createUser,login};

