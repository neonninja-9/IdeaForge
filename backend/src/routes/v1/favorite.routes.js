import { Router } from "express";
import {
    getFavorites,
    addFavorite,
    removeFavorite,
} from "../../controllers/favorite.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import { validateObjectId } from "../../middlewares/validateObjectId.js";

const router = Router();

router.use(authenticate);

router.get("/", getFavorites);
router.post("/:ideaId", validateObjectId("ideaId"), addFavorite);
router.delete("/:ideaId", validateObjectId("ideaId"), removeFavorite);

export default router;
