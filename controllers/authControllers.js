import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import User from "../models/User.js"; 


dotenv.config();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// --------------------------------------------------------------------------
// 1. REGISTER (DÜZELTİLDİ)
// --------------------------------------------------------------------------
export const register = async (req, res) => {
    try {
        // HATA DÜZELTME: Değişken isimleri req.body ile aynı olmalı.
        const { username, email, password, phoneNumber } = req.body;
        
        // HATA DÜZELTME: '|' yerine '||' kullanıldı.
        if (!username || !email || !password || !phoneNumber) {
            return res.status(400).json({ message: "Lütfen tüm alanları doldurun." });
        }
            
        // HATA DÜZELTME: 'await' eklendi.
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Bu kullanıcı zaten var." });
        }

        // HATA DÜZELTMe:await' eklendi.
        const hashedPassword = await bcrypt.hash(password, 10);

        // HATA DÜZELTME: 'User' modelini çağırırken 'new' keyword'ü veya create metodu.
        const newUser = await User.create({
            username, // name yerine username
            email,
            password: hashedPassword,
            phoneNumber
        });

        // Şifreyi response'dan çıkartmak için basit yöntem:
        res.status(201).json({ 
            message: "Kullanıcı başarıyla oluşturuldu.", 
            user: { id: newUser._id, email: newUser.email, username: newUser.username } 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// --------------------------------------------------------------------------
// 2. LOGIN (DÜZELTİLDİ)
// --------------------------------------------------------------------------
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) { // Kullanıcı yoksa hemen dön
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }

        // HATA DÜZELTME: 'await' eklendi ve mantık düzeltildi (!isMatch).
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(400).json({ message: "Email veya şifre hatalı." });
        }

        // HATA DÜZELTME: user_id undefined idi, user._id yapıldı.
        const payload = {
            id: user._id,
            email: user.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ message: "Giriş başarılı", token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// --------------------------------------------------------------------------
// 3. SEND OTP (DÜZELTİLDİ)
// --------------------------------------------------------------------------
export const sendOtp = async (req, res) => {
    try {
        // HATA DÜZELTME: Destructuring yapıldı { phoneNumber }
        const { phoneNumber } = req.body;

        // HATA DÜZELTME: Önce kullanıcıyı bulmalıyız!
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ message: "Bu numara ile kayıtlı kullanıcı yok." });
        }    

        const otpCode = generateOTP();

        // HATA DÜZELTME: Matematiksel işlem düzeltildi (5 dakika).
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

        // DB güncelleme
        user.otpCode = otpCode;
        user.otpExpires = otpExpires; // maxTime yerine otpExpires (Standardizasyon)
        await user.save();

        console.log(`📞 SMS Gönderildi: ${otpCode}`);

        res.status(200).json({ message: "OTP kodu gönderildi." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hata oluştu.', error: error.message });
    }
};

// --------------------------------------------------------------------------
// 4. VERIFY OTP (DÜZELTİLDİ)
// --------------------------------------------------------------------------
export const verifyOtp = async (req, res) => {
    try {
        const { phoneNumber, otpCode } = req.body;

        const user = await User.findOne({ phoneNumber });

        // HATA DÜZELTME: || operatörü kullanıldı.
        if (!user || !user.otpCode) {
            return res.status(400).json({ message: "Geçersiz istek." });
        }

        if (otpCode !== user.otpCode) {
            return res.status(400).json({ message: "Hatalı kod." });
        }

        // HATA DÜZELTME: Süre kontrolü
        if (user.otpExpires < Date.now()) {
             return res.status(400).json({ message: "Kodun süresi dolmuş." });
        }

        // Token üretimi eklendi
        const token = jwt.sign(
            { id: user._id, phoneNumber: user.phoneNumber },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Temizlik
        user.otpCode = null;
        user.otpExpires = null;
        await user.save();    

        return res.status(200).json({ message: "Giriş başarılı", token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Doğrulama hatası.', error: error.message });
    }
};