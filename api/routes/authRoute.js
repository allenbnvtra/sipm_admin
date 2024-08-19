import express from 'express';
import { login, logout } from '../controllers/authController.js';
import User from '../models/userModel.js';

const router = express.Router();

router.route('/login').post(login);
router.route('/logout').post(logout);

router.route('/').get(async (req, res) => {
  try {
    const user = await User.find();

    return res.json({ result: user });
  } catch (error) {
    console.log(error);
  }
});

export default router;
