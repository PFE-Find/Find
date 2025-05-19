import Notification from "../models/Notification.js";



export const getNotifById = async (req, res) => {
     try {
        const receiverId = req.params.id; // Or req.params.recipient, depending on your route
        const notifications = await Notification.find({ receiverId: receiverId }); 

        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: "No notifications found for this user" });
        }

        res.status(200).json(notifications);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: "Error fetching notifications", error: err.message }); // Include error message in response
    }
};
export const getUnreadCount = async (req, res) => {
    try {
        const receiverId = req.params.id;
        
        // Count only unread notifications (where isRead is false)
        const count = await Notification.countDocuments({ 
            receiverId: receiverId,
            isRead: false 
        });

        res.status(200).json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            message: "Error fetching unread notifications count", 
            error: err.message 
        });
    }
};

