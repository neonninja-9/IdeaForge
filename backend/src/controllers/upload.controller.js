import fs from "fs";
import path from "path";
import crypto from "crypto";
import AppError from "../utils/AppError.js";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");

// Ensure directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const uploadController = {
    /**
     * POST /api/v1/upload
     * Accepts: { data: "data:...;base64,...", name: "filename.ext", type: "image/png" }
     */
    async uploadFile(req, res, next) {
        try {
            const { data, name, type } = req.body;

            if (!data || !name) {
                throw new AppError("File data and name are required", 400);
            }

            // Extract base64 payload
            const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            let buffer;
            let mimeType = type || "application/octet-stream";

            if (matches && matches.length === 3) {
                mimeType = matches[1];
                buffer = Buffer.from(matches[2], "base64");
            } else {
                // If raw base64 without prefix
                buffer = Buffer.from(data, "base64");
            }

            // Max file size: 10 MB
            if (buffer.length > 10 * 1024 * 1024) {
                throw new AppError("File size exceeds 10MB limit", 400);
            }

            const ext = path.extname(name) || (mimeType.includes("image/png") ? ".png" : mimeType.includes("image/jpeg") ? ".jpg" : mimeType.includes("pdf") ? ".pdf" : ".bin");
            const safeBaseName = path.basename(name, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
            const uniqueSuffix = `${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
            const fileName = `${safeBaseName}_${uniqueSuffix}${ext}`;
            const filePath = path.join(UPLOADS_DIR, fileName);

            fs.writeFileSync(filePath, buffer);

            const fileUrl = `/uploads/${fileName}`;

            return res.status(201).json({
                status: "success",
                data: {
                    url: fileUrl,
                    name,
                    type: mimeType,
                    size: buffer.length,
                },
            });
        } catch (err) {
            next(err);
        }
    },
};

export default uploadController;
