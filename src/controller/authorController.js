const author = require("../models/authorModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { ENV } = require('../config/env');

// ========================================[create-author]====================================================================

const createAuthor = async function (req, res) {
  try{
     let data=req.body
  
    if (Object.keys(data).length === 0) return res.status(400).send({ msg: "please provide sufficient data " })

    if(!data.name){
     return res.status(400).send({status:false,message:"author name is required"})
    }


    if(!data.email){
      return res.status(400).send({status:false,message:" email is required"})
    }
    if (!/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(data.email)) {
      return res.status(400).send({status: false,message: "invalid emailId"});
    }
    let  email = await author.findOne({email:data.email})
    if (email) {  
      return res.status(400).send({status: false,message: "email already exists"});
    }

    if(!data.password){
        return res.status(400).send({status:false,message:" password is required"})
    }
 
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(data.password , salt);
    req.body.password = hashedPass;


       let authorCreated =await author.create(req.body)
       return res.status(201).send({status:true,data:authorCreated, msg:"created"}) 

    }
    catch (err) {
      res.status(500).send({error: err.message})
    }
  };


// =======================================authorLogin=============================================================

const authorLogin = async function (req, res) {
    try {
      const { email, password } = req.body;
      if (!email) {
        return res.status(400).send({ status: false, message: "Please provide email." });
      }
      if (!password) {
        return res.status(400).send({ status: false, message: "Please provide password." });
      }
  
      let authorData = await author.findOne({ email: email });
      if (!authorData) {
        return res.status(404).send({ status: false, message: "No data found." });
      }
  
      let checkPassword = await bcrypt.compare(password, authorData.password);
      if (checkPassword) {
        let accessToken = jwt.sign(
          {
            author_Id: authorData._id.toString(),
          },
          ENV.SECRETE_KEY, 
          { expiresIn: '160m' } 
        );
  
        res.status(201).send({ status: true, accessToken: accessToken,author_Id :authorData._id, message: "Login successful." });
      } else {
        return res.status(400).send({ status: false, message: "Login failed. Password is incorrect." });
      }
    } catch (error) {
      res.status(500).send({ status: false, message: error.message });
    }
  };
  

  
module.exports = {createAuthor ,authorLogin }
