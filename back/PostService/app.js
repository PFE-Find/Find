import express from 'express';
import mongoose from 'mongoose';
import itemRoutes from './routes/items.js';
import cors from 'cors';
import ReportRouter from './routes/Report.js';
import CommentRouter from './routes/comment.js';
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const PORT = process.env.PORT || 3001;
// Middleware to parse JSON bodies
app.use(express.json());
// Use item routes for all paths starting with "/api/items"
app.use('/api/Posts', itemRoutes);

app.use('/api/Comments',CommentRouter); 
app.use('/api/Reports',ReportRouter); 

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/PostsDB')
 .then(() => console.log('Connected to MongoDB'))
 .catch(err => console.error('Failed to connect to MongoDB',
err));
// Start the server
app.listen(PORT, () => {
  
 console.log(`Server running on port ${PORT}`);
});
export default app;