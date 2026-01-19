import { Router } from 'express';
import { register, login } from '../controllers/authControllers.js';
// Middleware test etmek istersen import et: import { authenticateToken } from './authMiddleware';

const router = Router();

// 1. POST isteği /register adresine gelirse 'register' fonksiyonunu çalıştır.
router.post('/register', register);

// 2. POST isteği /login adresine gelirse 'login' fonksiyonunu çalıştır.
router.post('/login', login);

// ÖRNEK: Sadece giriş yapmış kullanıcıların görebileceği bir rota örneği:
// router.get('/profile', authenticateToken, (req, res) => {
//    res.json({ message: 'Bu gizli veridir', user: req.user });
// });

export default router;