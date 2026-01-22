import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';


const authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new Error('Unauthorized');
        }

        const paylaod = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(payload.id);
        if (!user) {
            throw new Error('Unauthorized');
        }

        req.user = {
            id: user._id,
            email: user.email,
            username: user.username,
            phoneNumber: user.phoneNumber,
            avatarProfile: user.avatarProfile
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}


export { authenticateUser };