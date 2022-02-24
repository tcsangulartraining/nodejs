const jwt = require("jsonwebtoken");

var JWT_SECRET_KEY = 'ysmasd7a68764mllsdf834n';  
var TOKEN_HEADER_KEY = 'authorization';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers[TOKEN_HEADER_KEY];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, JWT_SECRET_KEY, (err, data) => {
  
      if (err) return res.sendStatus(403)
  
      console.log(data);
  
      next()
    });
};

module.exports = verifyToken;