import { body, validationResult } from 'express-validator';

// 1. Hata Yakalayıcı Yardımcı Fonksiyon
// (Bu fonksiyon validasyon kurallarından geçen hataları kontrol eder)
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Hataları dizi olarak dönüyoruz (örn: "Email geçersiz", "Şifre çok kısa")
        return res.status(400).json({ 
            message: "Veri doğrulama hatası", 
            errors: errors.array().map(err => err.msg) 
        });
    }
    next(); // Hata yoksa controller'a geç
};

// 2. Register (Kayıt) Kuralları
export const validateRegister = [
    body('username')
        .trim()
        .notEmpty().withMessage('Kullanıcı adı boş bırakılamaz.')
        .isLength({ min: 3 }).withMessage('Kullanıcı adı en az 3 karakter olmalıdır.'),
    
    body('email')
        .trim()
        .isEmail().withMessage('Geçerli bir email adresi giriniz.')
        .normalizeEmail(), // Email'i standart formata sokar (büyük/küçük harf vb.)

    body('password')
        .isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır.'),

    body('phoneNumber')
        .notEmpty().withMessage('Telefon numarası gereklidir.')
        .isMobilePhone().withMessage('Geçerli bir telefon numarası giriniz.'), // isMobilePhone isteğe bağlıdır

    // En sonda hata kontrol fonksiyonunu çağırıyoruz
    handleValidationErrors
];

// 3. Login (Giriş) Kuralları
export const validateLogin = [
    body('email')
        .trim()
        .isEmail().withMessage('Geçerli bir email adresi giriniz.'),
    
    body('password')
        .notEmpty().withMessage('Şifre gereklidir.'),

    handleValidationErrors
];