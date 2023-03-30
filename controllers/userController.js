const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'Congratulations, your account has been successfully created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const expiresIn = rememberMe ? '7d' : '24h'; // token expiration time
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn });
    user.tokens = user.tokens.concat({ token, expiresIn: Date.now() + expiresIn }); // add the token to the user's tokens array in the database
    await user.save(); // save the updated user object
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports.logoutUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = req.headers.authorization.split(' ')[1]; // get the token from the Authorization header
    const tokenIndex = user.tokens.findIndex(t => t.token === token); // find the index of the token in the user's tokens array
    if (tokenIndex !== -1) {
      user.tokens.splice(tokenIndex, 1); // remove the token from the user's tokens array
      await user.save(); // save the updated user object
    }
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
