import express from 'express';
import { addtrain, bookingdetails, bookseat, gettrains, signin, signup } from '../controller/auth.controller.js';
import { authenticateAdmin, authenticateJWT } from '../utils/middleware.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/add-Train", authenticateAdmin , addtrain);
router.post("/book-seat",authenticateJWT, bookseat);
router.get("/get-trains",authenticateJWT, gettrains);
router.get("/booking-deatils",authenticateJWT, bookingdetails);


export default router;