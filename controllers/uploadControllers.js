import { getFileUrl, validateFileContent, UPLOAD_DIR, deleteFile } from "../utils/storage.js";
import path from "path";
import User from "../models/User.js";


const uploadAvatarProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (!req.file) {
            throw new Error('No file uploaded');
        }

        const filePath = path.join(UPLOAD_DIR, req.file.filename);

        const isValidContent = validateFileContent(filePath, req.file.mimetype);

        if (!isValidContent) {
            await deleteFile(req.file.filename);
            throw new Error('Invalid file content');
        }

        const fileUrl = getFileUrl(req.file.filename);

        user.avatarProfile = fileUrl;
        await user.save();

        return res.status(200).json({ message: 'Avatar profile uploaded successfully', avatarProfile: fileUrl });
    } catch (error) {
        await deleteFile(req.file.filename);
        return res.status(500).json({ message: 'Failed to upload avatar profile', error: error.message });
    }
}