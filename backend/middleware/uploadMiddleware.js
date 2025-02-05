const multer = require("multer");
const path = require("path");
const fs = require("fs");

const fileUpload = require("express-fileupload");
app.use(fileUpload());

// Ensure directories exist
const homeworkFolder = path.join(__dirname, "../uploads/homework");
const projectsFolder = path.join(__dirname, "../uploads/personal_projects");

if (!fs.existsSync(homeworkFolder)) fs.mkdirSync(homeworkFolder, { recursive: true });
if (!fs.existsSync(projectsFolder)) fs.mkdirSync(projectsFolder, { recursive: true });

// Storage destination based on file type
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const type = req.body.type;
        const uploadPath = type === "assignment" ? homeworkFolder : projectsFolder;
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Allow only images and videos
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/mpeg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only images and videos are allowed."));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

module.exports = upload;
