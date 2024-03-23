
const blogsModel = require("../models/blogModel");

const jwt = require("jsonwebtoken");
const { ENV } = require('../config/env');

const authmid = (req, res, next) => {
  try {
    let token = req.headers.authorization;
   
    if (!token) {
      return res.status(401).json({ status: false, message: "The token must be required in 'Bearer'" });
    }
    token = token.replace("Bearer", "").trim(); 

    jwt.verify(token, ENV.SECRETE_KEY , function(err, decode) {
    
      if (err) {
        return res.status(401).json({ status: false, message: err.message });
      } else {
        req.tokenData = decode;
        next();
      }
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};




    // ==============================autherization==============================
    const authorise = async function (req, res, next) {
        try {
          let token = req.headers.authorization;
      
          if (!token || !token.startsWith('Bearer')) {
            return res.status(401).json({ status: false, message: "Token is required in 'Bearer' format" });
          }
      
          token = token.split(' ')[1];
      
          let decodedToken;
          try {
            decodedToken = jwt.verify(token, ENV.SECRETE_KEY); 
          } catch (error) {
            return res.status(400).send({ status: false, message: "Token is invalid or expired" });
          }
      
          let id = req.params.blogId;
          let findid = await blogsModel.findById(id);
      
          let findauthorId = decodedToken.author_Id.toString();
          let checkAuthor = findid.author_Id.toString();
      
          if (checkAuthor !== findauthorId) {
            return res.status(403).send({ status: false, message: "author is not allowed to modify this blog" });
          }
      
          next();
        } catch (err) {
          return res.status(500).send({ status: false, message: err.message });
        }
      };
      
module.exports.authmid = authmid;
module.exports.authorise = authorise;
