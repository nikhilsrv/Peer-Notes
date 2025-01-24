import multer from "multer";
import { v4 as uuidv4 } from "uuid";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniquePrefix = uuidv4();

    cb(null, uniquePrefix + "-" + file.originalname);
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});
