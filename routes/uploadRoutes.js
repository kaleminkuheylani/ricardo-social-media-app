import { Router } from "express";
import { upload } from "../utils/storage.js";
import { authenticateUser } from "../middleware/authMiddleware.js";


const uploadRouter = Router();


uploadRouter.post(
    '/avatar-profile',
    authenticateUser,
    // api limiter middleware
    upload.single('avatarProfile'),
    // controller for uploading
);


export default uploadRouter;