import User from "../models/User.js";

export const getUserById = async (req, res, next) => {
  try {
  

    // Assuming 'User' is a Mongoose model
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user); // Send the user as a JSON response
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" }); // Send error response
  }
};
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users);   
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" }); 
  }
};
