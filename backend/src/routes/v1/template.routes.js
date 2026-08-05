import { Router } from "express";
import templateController from "../../controllers/template.controller.js";

const router = Router();

router.get("/", templateController.list);

export default router;
