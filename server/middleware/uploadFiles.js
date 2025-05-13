import multer from 'multer';

// Memory storage — files will be in req.file.buffer
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Accept image files only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

export const uploadSingleImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 400 * 1024, // 400KB max
    },
}).single('image'); // expecting field name 'image'