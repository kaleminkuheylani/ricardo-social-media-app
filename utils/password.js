import bcrypt from 'bcrypt';
import crypto from 'crypto';


const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}


const comparePasswords = async (passwordToCompare, password) => {
    const passwordsMatch = await bcrypt.compare(passwordToCompare, password);
    return passwordsMatch;
}


export { hashPassword, comparePasswords };