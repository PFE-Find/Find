import User from "../models/User.js";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'
import { createVerificationToken, delelteExisitingToken, getVerificationTokenByEmail } from "./VerificationTokenController.js";
import { sendMail } from "./mailsend.js";


const domain = "http://localhost:3000"

export const generateVerificationToken = async (email) => {
  // generate random token
  const token = uuidv4();
  const expires = new Date().getTime() + 1000 * 60 * 60 * 24;


  const exisitingToken = await getVerificationTokenByEmail(email)

  if (exisitingToken) {
    await delelteExisitingToken(exisitingToken._id)
  }
  const verificationToken = await createVerificationToken({ email: email, token: token, expires: new Date(expires) });
  //const new_token = await getVerificationTokenByEmail(email)


  return verificationToken;


}




export const FindUserByEmail = async (req, res, next) => {

  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ data: 'User already exists' });
  return res.status(200).json({ data: "No USER Exits" });

}


export const SignUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);;

    const user = new User({
      name,
      email,
      password: hashedPassword,
    },);

    await user.save();
    const verificationToken = await generateVerificationToken(email);
    const confirmationLink = `${domain}/verify-email?token=${verificationToken.token}`


    sendMail(email, "Vérification d'email - Find", `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f0f8f7; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 5px; text-align: center;">
      <h2 style="color: #333333;">Welcome to Find!</h2>
      <p style="color: #555555;">Hi ${name},</p>
      <p style="color: #555555;">Thank you for signing up. Please verify your email address by clicking the button below:</p>
      <a href="${confirmationLink}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #007c72; color: #ffffff; text-decoration: none; border-radius: 4px;">Verify Email</a>
      <p style="color: #999999; margin-top: 20px;">If the button doesn't work, copy and paste the following link into your browser:</p>
      <p style="color: #999999; margin-top: 20px;">This link will expire in 24 hours.</p>
      <p style="color: #999999;">If you did not create an account, no further action is required.</p>
      <p style="color: #999999; margin-top: 30px;">Best regards,<br/>The Find Team</p>
    </div>
  </body>
</html>
`);
    res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!' });
  }
}


export const SignIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist" });

    // 2. Validate password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    // 3. Generate JWT token
    /*const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );*/

    // 4. Return user data and token (without password)
    const userData = {
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
    };
    res.status(200).json({ user: userData });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};