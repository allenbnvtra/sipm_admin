import { Conversation } from '../models/conversationModel.js';

const getConversation = async (currentUserId) => {
  if (!currentUserId) {
    return [];
  }

  try {
    const currentUserConversations = await Conversation.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .sort({ updatedAt: -1 })
      .populate('messages')
      .populate('sender')
      .populate('receiver');

    return currentUserConversations.map((conv) => {
      const countUnseenMsg = conv.messages.reduce((prev, curr) => {
        const msgByUserId = curr.msgByUserId?.toString();

        if (msgByUserId !== currentUserId) {
          return prev + (curr.seen ? 0 : 1);
        }
        return prev;
      }, 0);

      // Check if messages exist before accessing the last one
      const lastMsg = conv.messages.length
        ? conv.messages[conv.messages.length - 1]
        : null;

      return {
        _id: conv._id,
        sender: conv.sender,
        receiver: conv.receiver,
        unseenMsg: countUnseenMsg,
        lastMsg,
      };
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
};

const findOrCreateConversation = async (sender, receiver) => {
  try {
    let conversation = await Conversation.findOne({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    });

    if (!conversation) {
      conversation = new Conversation({ sender, receiver });
      await conversation.save();
    }

    return conversation;
  } catch (error) {
    console.error('Error finding or creating conversation:', error);
    throw error; // Re-throwing error might be useful for further handling
  }
};

export { getConversation, findOrCreateConversation };
