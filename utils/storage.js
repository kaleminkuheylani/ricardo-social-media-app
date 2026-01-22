import multer from "multer";
import path from "path";
import fs from "fs";


const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];


const FILE_SIGNATURES = {
    'image/jpeg': [Buffer.from([0xFF, 0xD8, 0xFF])],
    'image/png': [Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])],
    'image/webp': [Buffer.from('RIFF', 'ascii'), Buffer.from('WEBP', 'ascii')],
  };


const validateFileContent = (filePath, expectedMimeType) => {
    try {
        const fileBuffer = fs.readFileSync(filePath);

        const normalizedMimeType = expectedMimeType === 'image/jpg' ? 'image/jpeg' : expectedMimeType;

        const signatures = FILE_SIGNATURES[normalizedMimeType];

        if (!signatures) {
            return false;
        }

        if (normalizedMimeType === 'image/jpeg' || normalizedMimeType === 'image/png') {
            const signature = signatures[0];
            return fileBuffer.subarray(0, signature.length).equals(signature);
        }

        if (normalizedMimeType === 'image/webp') {
            const riffSignature = signatures[0];
            const webpSignature = signatures[1];
            return (
                fileBuffer.subarray(0, riffSignature.length).equals(riffSignature) &&
                fileBuffer.subarray(8, 8 + webpSignature.length).equals(webpSignature)
            )
        }

        return false;
    } catch (error) {
        return false;
    }
}




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-');
        cb(null, `profile-${uniqueSuffix}-${name}${ext}`);
    }
});



const fileFilter = (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(new Error(`Invalid file type. Only ${ALLOWED_MIME_TYPES.join(', ')} are allowed.`));
      return;
    }
    
    cb(null, true);
};



export const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE
    },
    fileFilter
});



export const getFileUrl = (filename) => {
    if (!filename) return '';
    
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }
    
    const baseUrl = process.env.FILE_BASE_URL || '/api/v1/uploads';
    return `${baseUrl}/${filename}`;
};


// this is for the local, with mongodb it should be changed
export const deleteFile = async (filename) => {
    if (!filename) return;
    
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return;
    }
    
    const filePath = path.join(UPLOAD_DIR, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
};



export const extractFilename = (url) => {
    if (!url) return '';
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return path.basename(new URL(url).pathname);
    }
    
    return path.basename(url);
  };
  
export { validateFileContent, UPLOAD_DIR };