const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, 'this_should_get_longer');
    req.userData = {email:decodedToken.email, userId: decodedToken.userId};
    next();
  }
  catch (e) {
    res.status(401).json({message:"You are not Authenticated!"});
  }
};
