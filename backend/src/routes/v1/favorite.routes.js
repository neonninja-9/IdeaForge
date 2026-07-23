import { Router } from "express";
import {
    getFavorites,
    addFavorite,
    removeFavorite,
} from "../../controllers/favorite.controller.js";
import authenticate from "../../middlewares/authenticate.js";

const router = Router();

router.use(authenticate);

router.get("/", getFavorites);
router.post("/:ideaId", addFavorite);
router.delete("/:ideaId", removeFavorite);

export default router;
