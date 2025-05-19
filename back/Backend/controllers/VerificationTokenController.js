
import express from 'express';
import VerificationToken from '../models/VerificationToken.js';
import User from '../models/User.js';

// Get all users

const router = express.Router();

export const getVerificationTokenByEmail = async (email) => {

  try {
    const VerificationToken_res = await VerificationToken.find({ email: email });
    return VerificationToken_res
  } catch (error) {
    console.error("Error fetching verification Token:", error);

  }
};


export const delelteExisitingToken = async (id) => {
  try {

    const deletedToken = await VerificationToken.findByIdAndDelete(id);


    console.log("token deleted succesfully")

  } catch (error) {
    console.error("Error deleting verification token:", error);

  }
};


export const createVerificationToken = async (token) => {

  try {
    console.log(token);
    const newItem = new VerificationToken(token);
    await newItem.save();
    console.log("token  created Succesfully")
    return newItem;
  }
  catch (error) {
    console.log(error);
  }

}

export const getVerificationTokenByToken = async (tokenString) => {

  try {
    const VerificationToken_res = await VerificationToken.findOne({ token: tokenString });
    console.log("found it ", VerificationToken_res);

    return VerificationToken_res
  } catch (error) {
    console.error("Error fetching verification Token:", error);

  }
}

export const FindUserByEmail = async (email) => {

  try {
    const existingUser = await User.findOne({ email });
    return existingUser;
  }
  catch (error) {
    return null
  }


}



export const verifyEmail = async (req, res, next) => {

  try {
    const { token } = req.body;
    const exisitingToken = await getVerificationTokenByToken(token);


    if (!exisitingToken) {
      res.status(404).json({ message: "error verifying email" });

    }

    const hasExprired = new Date(exisitingToken.expires) < new Date()
    if (hasExprired) {
      res.status(400).json({ message: "Token has expired" });
    }

    const existingUser = await FindUserByEmail(exisitingToken.email)

    if (!existingUser) {
      return res.status(404).json({ message: "No user Has been found" });
    }

     const result = await User.updateMany(
      { email: existingUser.email },              
      { $set: { emailVerified: new Date() } }   
    );
    delelteExisitingToken(exisitingToken._id);
    return res.status(200).json({ success: "Email verified" });

  }
  catch (error) {
    next(error);
    res.status(500).json({ message: "Internal server error" });

  }

}



export default router


