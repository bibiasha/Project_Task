const jwt=require('jsonwebtoken');


const authentication = async (request, res, next) => {
    try {
      const token = request.headers["api-key"]; 
      if (!token) return res.status(400).send({ status: false, message: "Token must be present." });
       jwt.verify( token, "asha", (err, decodedToken) => {
          if (err) {
            return res.status(401).send({ status: false, message: err.message });
          }
          request.decodedToken = decodedToken;
          next();
        }
      );
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };

  module.exports={authentication};