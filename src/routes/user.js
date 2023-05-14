const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/auth');

const User = require('../models/user')


/** Route to signup */
// GET localhost:3000/users/user
router.get('/user', authenticate, async (req, res) => {
    try {
      const user = await User.findById(req.auth.userId);
      return res.json({ user });
    } catch (err) {
      console.log(err.message);
      res.status(400).json({ error: err.message });
    }
  });


/** Route to signup */
// POST localhost:3000/users/signup
router.post('/signup', async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.MY_SECRET, { expiresIn: '3h' });
      res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
      return res.json({ token });
    } catch (err) {
      console.log(err.message);
      res.status(400).json({ error: err.message });
    }
  });

/** Route to login */
// POST localhost:3000/users/login
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username }, 'username password');
      if (!user) {
        return res.status(401).send({ message: 'Username or Password does not match our records' });
      }

      user.comparePassword(password, (err, isMatch) => {
        if (!isMatch) {
          return res.status(401).send({ message: 'Username or password does not match our records' });
        }
        // Create a token
        const token = jwt.sign({ userId: user._id }, process.env.MY_SECRET, {expiresIn: '3h',});
        res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
        return res.json({ token });
      });
    } catch (err) {
      console.log(err.message);
      res.status(400).json({ error: err.message });
    }
  });

  /** Route to update user info */
// PUT localhost:3000/users/update
  router.put('/update', authenticate, async (req, res) => {
    try {
      const user = await User.findById(req.auth.userId);
      if (req.body.username) {
        user.username = req.body.username;
      }
      if (req.body.password) {user.password = req.body.password;}
      await user.save();
      return res.json({ message: 'Updated successful!' });
    } catch (err) {
      console.log(err.message);
      res.status(400).json({ error: err.message });
    }
  });
  
  /** Route to delete user */
// DELETE localhost:3000/users/update
  router.delete('/delete', authenticate, async (req, res) => {
    try {
      await User.findByIdAndDelete(req.auth.userId);
      return res.json({
        message: 'User deleted.',
        _id: req.params.userId,
      });
    } catch (err) {
      console.log(err.message);
      res.status(400).json({ error: err.message });
    }
  });

module.exports = router

