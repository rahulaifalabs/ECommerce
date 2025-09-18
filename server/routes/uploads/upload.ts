// server/routes/upload.ts
import { Router, Request, Response } from "express";
import { upload } from "../../middleware/upload";

const router = Router();

// Single file upload
router.post("/single", upload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  res.json({
    success: true,
    fileUrl: `/uploads/${req.file.filename}`,
  });
});

// Multiple file upload
router.post("/multiple", upload.array("images", 5), (req: Request, res: Response) => {
  if (!req.files) {
    return res.status(400).json({ success: false, message: "No files uploaded" });
  }
  const files = (req.files as Express.Multer.File[]).map((file) => ({
    fileUrl: `/uploads/${file.filename}`,
  }));
  res.json({ success: true, files });
});

export default router;
