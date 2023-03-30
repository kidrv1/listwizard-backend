const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports.checkTokenExpiration = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // get the token from the Authorization header
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // decode the token to get the user ID
    const user = await User.findOne({ _id: decodedToken.userId });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const tokenIndex = user.tokens.findIndex(t => t.token === token); // find the index of the token in the user's tokens array
    if (tokenIndex === -1) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const tokenExpiration = user.tokens[tokenIndex].expiresIn;
    if (Date.now() > tokenExpiration) { // check if the current time is greater than the token expiration time
      user.tokens.splice(tokenIndex, 1); // remove the expired token from the user's tokens array
      await user.save(); // save the updated user object
      return res.status(401).json({ message: 'Token expired' });
    }
    req.userId = decodedToken.userId; // set the user ID in the request object for future use
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
