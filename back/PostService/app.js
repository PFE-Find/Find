import express from 'express';
import mongoose from 'mongoose';
import itemRoutes from './routes/items.js';
import cors from 'cors';
import ReportRouter from './routes/Report.js';
import MessageRouter from './routes/message.js';
import NotificationRouter from './routes/notification.js';
import CommentRouter from './routes/comment.js';
import UserRouter from './routes/user.js';
import VerifTokenRouter from  './routes/veriftoken.js'; 
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import Message from './models/Message.js'; // Import the Message model
import Notification from './models/Notification.js'; // Import the Message model
import path from 'path';
const app = express();
const server = http.createServer(app); // Create the HTTP server
// Create the WebSocket server

const wss = new WebSocketServer({ server });

// Middleware setup
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(
    '/uploads',
    express.static(path.join(process.cwd(), 'uploads'))
);
const PORT = process.env.PORT || 3001;

// CORS Configuration
const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));

// Route setup
app.use('/api/Posts', itemRoutes);
app.use('/api/auth', UserRouter);
app.use('/api/Comments', CommentRouter);
app.use('/api/Reports', ReportRouter);
app.use('/api/Message', MessageRouter);

app.use('/api/VerificationToken',VerifTokenRouter)

app.use('/api/Notification', NotificationRouter);

// WebSocket Logic
wss.on('connection', (ws, req) => {
    const userId = req.url.split('?userId=')[1];
    console.log(`User ${userId} connected`);

    // Store the userId with the WebSocket connection
    ws.userId = userId;

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            switch (data.type) {

                case 'NEW_NOTIFICATION':
                    // Save message to the database
                    const notifdata = { ...data.notification };
                    //Crucial change: remove the _id field
                    delete notifdata._id;

                    const newnotif = new Notification(notifdata);
                    const savedNotif = await newnotif.save();

                    // Emit the saved message to the receiver and sender
                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            if (client.userId === savedNotif.receiverId || client.userId === savedNotif.senderId) {
                                client.send(JSON.stringify({
                                    type: 'NEW_NOTIFICATION',
                                    notification: savedNotif,
                                    userid: savedNotif.receiverId  ,
                                }));
                            }
                        }
                    });
                    break;

                case 'NEW_MESSAGE':
                    // Save message to the database
                    const messageData = { ...data.message };
                    //Crucial change: remove the _id field
                    delete messageData._id;

                    const newMessage = new Message(messageData);
                    const savedMessage = await newMessage.save();

                    // Emit the saved message to the receiver and sender
                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            if (client.userId === savedMessage.receiverId || client.userId === savedMessage.senderId) {
                                client.send(JSON.stringify({
                                    type: 'NEW_MESSAGE',
                                    message: savedMessage,
                                    
                                }));
                            }
                        }
                    });
                    break;

                case 'MARK_NOTIFICATION_READ':
                    try {
                        const notificationId = data.notificationId;
                        await Notification.findByIdAndUpdate(notificationId, { isRead: true });

                        // Notify all clients, especially the one who owns the notification
                        wss.clients.forEach(client => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({
                                    type: 'NOTIFICATION_READ',
                                    user: notificationId,
                                    userid: client.userId ,
                                }));
                            }
                        });
                    } catch (error) {
                        console.error("Error marking notification as read:", error);
                        ws.send(JSON.stringify({
                            type: 'notificationError',
                            error: 'Failed to mark notification as read'
                        }));
                    }
                    break;
                case 'DELETE_NOTIFICATION':
                    try {
                        const notificationId = data.notificationId;
                        await Notification.findByIdAndDelete(notificationId);

                        // Notify all clients that the notification has been deleted
                        wss.clients.forEach(client => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({
                                    type: 'NOTIFICATION_DELETED',
                                    notificationId: notificationId
                                }));
                            }
                        });
                    } catch (error) {
                        console.error("Error deleting notification:", error);
                        ws.send(JSON.stringify({
                            type: 'notificationError',
                            error: 'Failed to delete notification'
                        }));
                    }
                    break;

                case 'MARK_ALL_NOTIFICATIONS_READ':
                    try {
                        // Assuming you have the userId available on the WebSocket connection
                        const userId = ws.userId;

                        await Notification.updateMany({ receiverId: userId }, { isRead: true });

                        // Notify only the client that requested to mark all notifications as read
                         wss.clients.forEach(client => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({
                                    type: 'ALL_NOTIFICATIONS_READ',
                                userId: userId
                                }));
                            }
                        });
                        
                    } catch (error) {
                        console.error("Error marking all notifications as read:", error);
                        ws.send(JSON.stringify({
                            type: 'notificationError',
                            error: 'Failed to mark all notifications as read'
                        }));
                    }
                    break;

                case 'DELETE_MESSAGE':
                    // Delete the message from the database
                    const deletedMessage = await Message.findByIdAndDelete(data.messageId);

                    if (deletedMessage) {
                        // Emit the messageDeleted event to all connected clients
                        wss.clients.forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({
                                    type: 'MESSAGE_DELETED',
                                    messageId: data.messageId,
                                }));
                            }
                        });
                    } else {
                        console.log(`Message with ID ${data.messageId} not found`);
                        ws.send(JSON.stringify({
                            type: 'messageError',
                            error: 'Message not found',
                        }));
                    }
                    break;
                case 'UPDATE_MESSAGE':
                    // Update the message in the database
                    const message = await Message.findByIdAndUpdate(
                        data.messageId,
                        { $set: { text: data.text, isEdited: true } },
                        { new: true }
                    );

                    if (message) {
                        // Emit the updated message to all connected clients
                        wss.clients.forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({
                                    type: 'MESSAGE_UPDATED',
                                    message,
                                }));
                            }
                        });
                    } else {
                        console.log(`Message with ID ${data.messageId} not found`);
                        ws.send(JSON.stringify({
                            type: 'messageError',
                            error: 'Message not found',
                        }));
                    }
                    break;
                case 'user_converstion':
                    // Update the message in the database
                    const message2 = await Message.findByIdAndUpdate(
                        data.messageId,
                        { $set: { text: data.text, isEdited: true } },
                        { new: true }
                    );

                    if (message2) {
                        // Emit the updated message to all connected clients
                        wss.clients.forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({
                                    type: 'MESSAGE_UPDATED',
                                    message2,
                                }));
                            }
                        });
                    } else {
                        console.log(`Message with ID ${data.messageId} not found`);
                        ws.send(JSON.stringify({
                            type: 'messageError',
                            error: 'Message not found',
                        }));
                    }
                    break;
                case 'MESSAGE_READ':
                    // Update the message read status in the database
                    await Message.updateMany({
                        senderId: data.senderId,
                        receiverId: data.receiverId,
                        isRead: false,
                    }, { $set: { isRead: true } });

                    // Emit the message read status to the sender
                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN && client.userId === data.senderId) {
                            client.send(JSON.stringify({
                                type: 'MESSAGE_READ',
                                senderId: data.receiverId,
                                receiverId: data.senderId,
                            }));
                        }
                    });
                    break;
                default:
                    console.log('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error("Error handling message:", error);
            ws.send(JSON.stringify({
                type: 'messageError',
                error: 'Failed to handle message',
            }));
        }
    });

    ws.on('close', () => {
        console.log(`User ${userId} disconnected`);
    });
});

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/PostsDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;