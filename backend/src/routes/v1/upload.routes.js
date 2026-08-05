import { Router } from "express";
import uploadController from "../../controllers/upload.controller.js";
import authenticate from "../../middlewares/authenticate.js";

const router = Router();

router.post("/", authenticate, uploadController.uploadFile);

export default router;
