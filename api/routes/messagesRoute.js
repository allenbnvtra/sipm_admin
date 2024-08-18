import express from 'express';
import { getTwoWayMessages } from '../controllers/messagesController.js';

const router = express.Router();

router.get('/:conversationId', getTwoWayMessages);

export default router;
