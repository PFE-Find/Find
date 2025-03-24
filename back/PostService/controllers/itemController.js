import Item from '../models/Post.js';
import Image from '../models/Image.js';
export const createItem = async (req, res, next) => {
  try {
    // Destructure photos from the request body
    const { photos, ...postData } = req.body;
    
    // Create and save the post
    const newItem = new Item(postData);
    await newItem.save();

    // If photos exist, create image documents for each one
    if (photos && photos.length > 0) {
      const imagesToInsert = photos.map((path) => ({
        postId: newItem._id,
        path,
      }));
      await Image.insertMany(imagesToInsert);
    }
    
    res.status(201).json({ post: newItem, photos });
  } catch (error) {
    next(error);
  }
};

export const getItems = async (req, res, next) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (error) {
    next(error);
  }
};
