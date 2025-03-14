const User = require('../db/models/UserSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//1.SignUp User
module.exports.signUpUser = async (req, res) => {
  try {
    const body = req.body;
    const user = await User.findOne({ email: body.email });

    if (user) {
      return res.status(403).json({ message: 'Email already taken' });
    }

    if (body.password != body.confirmPassword) {
      return res.status(403).json({ message: 'passwords not matching' });
    }

    const hashPassword = await bcrypt.hash(body.password, 2);
    const hashConfirmPassword = await bcrypt.hash(body.confirmPassword, 2);
    body.password = hashPassword;
    body.confirmPassword = hashConfirmPassword;

    const newUser = await User.create(body);
    return res.status(200).json({ message: 'sign up complete', newUser });
  } catch (e) {
    return res.status(500).json({ message: 'Internal server error', e });
  }
};

//2. Login User
module.exports.loginUser = async (req, res) => {
  try {
    const body = req.body;
    const user = await User.findOne({ email: body.email });

    if (!user) {
      return res.status(403).json({ message: 'Please sign up' });
    }

    const isMatchingg = await bcrypt.compare(body.password, user.password);

    if (!isMatchingg) {
      return res.status(403).json({ message: 'passwords not matching' });
    }

    const token = jwt.sign(
      { id: user._id, role: 'USER' },
      process.env.USERKEY,
      { expiresIn: '365d' }
    );

    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({ message: 'Login sucess', token, id: user._id });
  } catch (e) {
    res.status(500).json({ message: 'Internal Server error', e });
  }
};

//3.Logout User

module.exports.logOut = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(403).json({ message: "User is required!" })
    }
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(403).json({ message: "User is invalid" });
    }

    await User.findByIdAndUpdate(userId, { token: null });

    res.status(200).json({ message: 'Logged Out Sccessfully' });
  } catch (e) {
    res.status(500).json({ message: 'Internal error', error: e.message });
  }
};
