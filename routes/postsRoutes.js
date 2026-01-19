import express from "express";

// TODO 1: Controller fonksiyonlarını import et.
// İPUCU: createPost, getFeedPosts, getUserPosts, likePost
import {createPost, getFeedPosts,getUserPosts,likePost } from "../controllers/postController.js";

// TODO 2: Güvenlik için Auth Middleware'ini import et.
// İPUCU: authMiddleware.js dosyasındaki 'verifyToken' fonksiyonu.



const router = express.Router();

// ======================================================================
// OKUMA ROTALARI (READ)
// ======================================================================

/* 1. ANA SAYFA AKIŞI
   - URL: /api/posts/
   - Güvenlik: Giriş yapmış olmalı
   - Fonksiyon: getFeedPosts
*/
router.get("/", getFeedPosts);

/* 2. KULLANICI PROFİLİ
   - URL: /api/posts/user/:userId  (Örn: /api/posts/user/12345)
   - Güvenlik: Giriş yapmış olmalı
   - Fonksiyon: getUserPosts
   - DİKKAT: URL'de değişken (:userId) olmalı.
*/
router.get("/user/:userId", getUserPosts);


/* 3. POST OLUŞTURMA
   - URL: /api/posts/create
   - Method: POST
   - Güvenlik: Şart
   - Fonksiyon: createPost
*/
router.post("/create", createPost);

/* 4. BEĞEN / VAZGEÇ (LIKE / UNLIKE)
   - URL: /api/posts/:id/like
   - Method: PATCH (Çünkü sadece likes dizisini güncelliyoruz)
   - Güvenlik: Şart
   - Fonksiyon: likePost
   - DİKKAT: Hangi postu beğendiğimizi URL'deki :id ile belirtmeliyiz.
*/
router.patch("/:id/like", likePost);

export default router;