import User from "../models/User.js";
import bcrypt from 'bcrypt';



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
    }, { timestamps: true });
    
    await user.save();
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