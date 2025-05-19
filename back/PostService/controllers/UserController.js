import User from "../models/User.js";
import express from 'express';

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcrypt';
import multer from 'multer';
const router = express.Router();
// Create __dirname equivalent for ES modules
// controllers/UserController.js
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    let role = req.body.role;
console.log("role",role);
    
    role = Number(role);

  
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'Rôle utilisateur mis à jour avec succès', user });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du rôle de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = { ...req.body };
   
    
    // Handle password hashing if provided
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // Handle image file upload
    if (req.file) {
      // Find user to get the old image
      const user = await User.findById(id);
      if (user && user.image) {
        const oldImagePath = path.join(process.cwd(), user.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      // Save new image path (relative to /uploads)
      updates.image = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Exclude password from response
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
  




// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id || req.query.id || req.body.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users);   
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" }); 
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  console.log("delete : ",req.params);
  
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      message: "User deleted successfully",
      deletedUserId: id
    });
    
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default router;