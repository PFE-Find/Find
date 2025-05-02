import Message from "../models/Message.js";

import User from "../models/User.js";

export const createMessage = async (req, res) => {
    try {
        const newMessage = new Message({
            senderId: req.body.senderId,
            receiverId: req.body.receiverId,
            text: req.body.text,
        });

        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage); // 201 Created
    } catch (err) {
        res.status(500).json(err);
    }
}
// Get all messages
export const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
}

// Get messages by ID
export const getMessagesById = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        res.status(200).json(message);
    } catch (err) {
        res.status(500).json(err);
    }
}

// Get user by ID (assuming senderId or receiverId refers to a user ID)
export const getUsersConversations= async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find all messages where the user is either the sender or the receiver
        const messages = await Message.find({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        });

        // Extract the IDs of the other users in the conversations
        const otherUserIds = new Set();
        messages.forEach(message => {
            if (message.senderId !== userId) {
                otherUserIds.add(message.senderId);
            }
            if (message.receiverId !== userId) {
                otherUserIds.add(message.receiverId);
            }
        });

        // Convert the Set to an array
        const uniqueUserIds = Array.from(otherUserIds);

        // Fetch the user data for each of the other users
        const users = await User.find({ _id: { $in: uniqueUserIds } });

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
}

// Delete message
export const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
}
export const getConversation= async (req, res) => {
    
    
    try {
        const user1Id = req.params.user1Id;
        const user2Id = req.params.user2Id;

        // Find messages where either user1 is the sender and user2 is the receiver,
        // or user2 is the sender and user1 is the receiver.
        const messages = await Message.find({
            $or: [
                { senderId: user1Id, receiverId: user2Id },
                { senderId: user2Id, receiverId: user1Id }
            ]
        }).sort({ createdAt: 1 }); // Sort by creation date (oldest first)

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
}
// Update message
export const updateMessage = async (req, res) => {
    try {
        const { text } = req.body; // Destructure text from body
        
        if (!text) {
            return res.status(400).json({ message: "Text is required" });
        }

        const message = await Message.findByIdAndUpdate(
            req.params.id, 
            { $set: { text } }, // Update only the text field
            { new: true } // Return the updated document
        );

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        
        res.status(200).json(message);
    } catch (err) {
        res.status(500).json(err);
    }
};
