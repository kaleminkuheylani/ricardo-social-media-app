import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    // 1. İLİŞKİ (RELATIONSHIP) - EN ÖNEMLİ KISIM
    // Burası "Bu postu kim attı?" sorusunun cevabıdır.
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Bu alan özel bir ID tipindedir
      ref: "User", // BU İSİM ÇOK ÖNEMLİ! (User.js'deki model ismiyle aynı olmalı)
      required: true,
    },

    // 2. İÇERİK
    content: {
      type: String,
      required: true, // Boş post atılamaz
      maxlength: 500, // Twitter gibi karakter sınırı koyabilirsin
    },

    // 3. RESİM (Opsiyonel)
    // Resim yüklemek zorunda değil, o yüzden required: false (varsayılan)
    image: {
      type: String, // Resmin dosya yolu veya URL'si tutulur
      default: "",
    },

    // 4. BEĞENİLER
    // Postu beğenen kullanıcıların ID'lerini burada bir liste (dizi) olarak tutacağız.
    // Örn: likes: ["user_id_1", "user_id_2"]
    likes: {
      type: Array,
      default: [],
    },
  },
  // 5. ZAMAN DAMGASI (TIMESTAMPS)
  // Mongoose bizim için otomatik olarak 'createdAt' ve 'updatedAt' alanlarını oluşturur.
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;