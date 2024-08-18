import { Conversation } from '../models/conversationModel.js';

export const getTwoWayMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId)
      .populate('messages')
      .sort({ updatedAt: -1 });

    if (!conversation) {
      return res.status(404).json({
        status: 'fail',
        message: 'Conversation not found',
      });
    }

    res.status(200).json({
      status: 'success',
      result: conversation,
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
