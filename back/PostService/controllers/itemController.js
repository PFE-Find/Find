import Post from '../models/Post.js';
import Land from '../models/Land.js';
import Material from '../models/Material.js';
import Image from '../models/Image.js';

export const createItem = async (req, res, next) => {
  try {
    const { photos, propertyType, ...postData } = req.body;
    let newItem;

    // Ensure propertyType is provided and valid
    if (!propertyType || !['Land', 'Material'].includes(propertyType)) {
      return res.status(400).json({ error: 'Invalid property type' });
    }

    // Create post based on propertyType
    if (propertyType === 'Material') {
      newItem = new Material({ ...postData, propertyType });
    } else if (propertyType === 'Land') {
      newItem = new Land({ ...postData, propertyType });
    } else {
      newItem = new Post({ ...postData, propertyType });
    }

    await newItem.save();

    // Save images if provided
    if (photos && Array.isArray(photos) && photos.length > 0) {
      const imagesToInsert = photos.map((path) => ({
        postId: newItem._id,  // Associate the image with the post
        path,
      }));
      const savedImages = await Image.insertMany(imagesToInsert);

      // Associate the images with the post
      newItem.images = savedImages.map(image => image._id);
      await newItem.save();  // Save the updated post with image references
    }

    res.status(201).json({ post: newItem, photos });
  } catch (error) {
    next(error);
  }
};

export const getItems = async (req, res, next) => {
  try {
    const items = await Post.find()
      .populate({
        path: 'images',  // This will populate the 'images' field with Image documents
        select: 'path date',  // Only select the 'path' and 'date' fields from the Image model
      })
      .exec();

    const allItems = items.map((post) => ({
      ...post.toObject(),
      images: post.images || [],  // Ensure images are included even if none are found
    }));

    res.json(allItems);
  } catch (err) {
    next(err);
  }
};
export const getItems1 = async (req, res, next) => {
  try {
    const items = await Post.find({ statut: true })
      .populate({
        path: 'images',
        select: 'path date',
      })
      .exec();

    const allItems = items.map((post) => ({
      ...post.toObject(),
      images: post.images || [], 
    }));

    res.json(allItems);
  } catch (err) {
    next(err);
  }
};
export const getItems2 = async (req, res, next) => {
  try {
    const items = await Post.find({ statut: false }) 
      .populate({
        path: 'images', 
        select: 'path date', 
      })
      .exec();

    const allItems = items.map((post) => ({
      ...post.toObject(),
      images: post.images || [], 
    }));

    res.json(allItems);
  } catch (err) {
    next(err);
  }
};



export const getItems3 = async (req, res, next) => {
  try {
    const userId = req.params.id;
    

    const items = await Post.find({ id_user: userId, statut: true })
      .populate({
        path: 'images',
        select: 'path date',
      })
      .exec();

    

    if (!items || items.length === 0) {
      return res.status(404).json({ message: 'No items found for this user' });
    }

    const itemsPlain = items.map((item) => ({
      ...item.toObject(),
      images: item.images || [],
    }));

   

    res.json(itemsPlain);
  } catch (error) {
    console.error("Error fetching items:", error);
    next(error);
  }
};
export const getItems4 = async (req, res, next) => {
  try {
    const userId = req.params.id;
    

    const items = await Post.find({ id_user: userId, statut: false })
      .populate({
        path: 'images',
        select: 'path date',
      })
      .exec();

    

    if (!items || items.length === 0) {
      return res.status(404).json({ message: 'No items found for this user' });
    }

    const itemsPlain = items.map((item) => ({
      ...item.toObject(),
      images: item.images || [],
    }));

    

    res.json(itemsPlain);
  } catch (error) {
    console.error("Error fetching items:", error);
    next(error);
  }
};

export const updateOffreStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    // You can add validation for status if needed
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { statut: true }, // set statut to 1
      { new: true } // return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Offre not found." });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    next(err);
  }
};






export const getItemById = async (req, res, next) => {
  try {
    const item = await Post.findById(req.params.id)
      .populate({
        path: 'images',  // Populate the 'images' field with Image documents
        select: 'path date',  // Only select the 'path' and 'date' fields
      })
      .exec();

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({
      ...item.toObject(),
      images: item.images || [], // Ensure images are included even if none are found
    });
  } catch (error) {
    next(error);
  }
};


export const updateItem = async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const { photos, ...updateData } = req.body;

    // Find the item to update
    const item = await Post.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update the item's data
    Object.assign(item, updateData); //Safely update existing fields

    // Handle image updates
    if (photos && Array.isArray(photos)) {
      // Delete existing images (optional, depends on your requirements)
      await Image.deleteMany({ postId: itemId });

      const imagesToInsert = photos.map((path) => ({ postId: itemId, path }));
      const savedImages = await Image.insertMany(imagesToInsert);
      item.images = savedImages.map((image) => image._id);
    }

    await item.save();
    res.json(item);
  } catch (error) {
    console.error("Error updating item:", error); // Log the error for debugging
    next(error); // Pass the error to the error handling middleware
  }
};

export const deleteItem = async (req, res, next) => {
  
  try {
    const itemId = req.params.id;

    // Find the item to delete
    const item = await Post.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Delete associated images (important to avoid orphaned images)
    await Image.deleteMany({ postId: itemId });

    // Delete the item
    await Post.findByIdAndDelete(itemId);

    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error("Error deleting item:", error); // Log the error for debugging
    next(error); // Pass the error to the error handling middleware
  }
};
