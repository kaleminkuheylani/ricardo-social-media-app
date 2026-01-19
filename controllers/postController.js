import Post from "../models/Post.js";
import User from "../models/User.js";

// ======================================================================
// 1. CREATE POST
// ======================================================================
export const createPost = async (req, res) => {
    try {
        const { content, image } = req.body;
        
        // DÜZELTME: req.user.id doğrudan bir string değeridir, destructuring yapılmaz.
        const userId = req.user.id; 

        // DÜZELTME: 'Post.craete' yanlıştı. 'new Post' yapısı daha güvenlidir.
        const newPost = new Post({
            userId, // Modelde 'userID' mi 'userId' mi tanımladın? Genelde userId (camelCase) kullanılır.
            content,
            image,
            likes: []
        });

        await newPost.save();

        // DÜZELTME: findById sözdizimi düzeltildi ve typo giderildi (avater -> avatar)
        const fullPost = await Post.findById(newPost._id)
            .populate("userId", "avatarProfile username"); // name yerine username (User modeline göre değişir)

        // DÜZELTME: res.staus -> res.status
        return res.status(201).json(fullPost);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ======================================================================
// 2. GET FEED POSTS
// ======================================================================
export const getFeedPosts = async (req, res) => {
    try {
        // DÜZELTME: created_At -> createdAt (Mongoose timestamps standardı)
        const posts = await Post.find()
            .populate("userId", "avatarProfile username")
            .sort({ createdAt: -1 }); 

        return res.status(200).json(posts);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// ======================================================================
// 3. GET USER POSTS
// ======================================================================
export const getUserPosts = async (req, res) => {
    try {
        // Parametreden gelen ID (URL: /posts/12345)
        const { userId } = req.params; 

        // DÜZELTME: Sorguda userId kullanıyoruz
        const userPosts = await Post.find({ userId })
            .populate("userId", "avatarProfile username")
            .sort({ createdAt: -1 });

        return res.status(200).json(userPosts);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// ======================================================================
// 4. LIKE / UNLIKE POST (TAMAMLANMIŞ HALİ)
// ======================================================================
export const likePost = async (req, res) => {
    try {
        const { id } = req.params; // URL'den post id'si (genelde id olarak gelir)
        const userId = req.user.id; // Token'dan gelen kullanıcı id'si

        // DÜZELTME: find() dizi döner, findById() tek obje döner. Bize tek obje lazım.
        const post = await Post.findById(id);
        
        if (!post) return res.status(404).json({ message: "Post bulunamadı" });

        // MANTIK KONTROLÜ: Kullanıcı daha önce beğenmiş mi?
        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            // VARSA -> ÇIKAR (Toggle Off)
            post.likes = post.likes.filter((l) => l !== userId);
        } else {
            // YOKSA -> EKLE (Toggle On)
            post.likes.push(userId);
        }

        // GÜNCELLEME VE YANIT
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        ).populate("userId", "avatarProfile username");

        return res.status(200).json(updatedPost);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};