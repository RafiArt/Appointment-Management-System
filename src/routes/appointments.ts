import { Router, Response } from "express";
import { AppDataSource } from "../config/database";
import { Appointment } from "../models/Appointment";
import { User } from "../models/User";
import { authMiddleware, AuthRequest } from "../middlewares/auth";
import { isWithinWorkingHours, convertToUserTimezone } from "../utils/timezone";

const router = Router();
const appointmentRepository = AppDataSource.getRepository(Appointment);
const userRepository = AppDataSource.getRepository(User);

// Create appointment
router.post("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, start, end, participantIds } = req.body;
  const creatorId = req.user.id;

  try {
    const participants = await userRepository.findByIds(participantIds);
    const creator = await userRepository.findOneBy({ id: creatorId });

    if (!creator) {
      res.status(404).json({ message: "Creator not found" });
      return;
    }

    const isValidTime = participants.every((participant) =>
      isWithinWorkingHours(new Date(start), participant.preferredTimezone) &&
      isWithinWorkingHours(new Date(end), participant.preferredTimezone)
    );

    if (!isValidTime) {
      res.status(400).json({
        message: "Appointment must be within working hours (09:00-17:00) for all participants"
      });
      return;
    }

    const appointment = appointmentRepository.create({
      title,
      start: new Date(start),
      end: new Date(end),
      creator,
      participants
    });

    await appointmentRepository.save(appointment);
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get appointments
router.get("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await userRepository.findOneBy({ id: req.user.id });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const appointments = await appointmentRepository
      .createQueryBuilder("appointment")
      .leftJoinAndSelect("appointment.creator", "creator")
      .leftJoinAndSelect("appointment.participants", "participants")
      .where("creator.id = :userId", { userId: user.id })
      .orWhere("participants.id = :userId", { userId: user.id })
      .getMany();

    const convertedAppointments = appointments.map(appointment => ({
      ...appointment,
      start: convertToUserTimezone(
        appointment.start,
        "UTC",
        user.preferredTimezone
      ),
      end: convertToUserTimezone(
        appointment.end,
        "UTC",
        user.preferredTimezone
      )
    }));

    res.json(convertedAppointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;