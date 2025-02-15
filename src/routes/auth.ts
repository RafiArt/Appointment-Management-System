import { Router } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

const router = Router();
const userRepository = AppDataSource.getRepository(User);

router.post("/login", async (req, res) => {
  const { username } = req.body;

  try {
    const user = await userRepository.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;