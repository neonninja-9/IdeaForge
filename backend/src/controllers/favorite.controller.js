import Favorite from "../../models/favorite.js";
import AppError from "../utils/AppError.js";

/**
 * Get all favorited idea IDs for the current user
 * GET /api/v1/favorites
 */
export const getFavorites = async (req, res, next) => {
    try {
        const favorites = await Favorite.find({ user: req.user.id }).select("idea");
        const ideaIds = favorites.map(f => f.idea);
        
        res.status(200).json({
            status: "success",
            data: {
                favorites: ideaIds,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Add an idea to favorites
 * POST /api/v1/favorites/:ideaId
 */
export const addFavorite = async (req, res, next) => {
    try {
        const { ideaId } = req.params;
        
        const existing = await Favorite.findOne({ idea: ideaId, user: req.user.id });
        if (existing) {
            return res.status(200).json({
                status: "success",
                data: { favorite: existing }
            });
        }
        
        const favorite = await Favorite.create({
            idea: ideaId,
            user: req.user.id,
        });

        res.status(201).json({
            status: "success",
            data: {
                favorite,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Remove an idea from favorites
 * DELETE /api/v1/favorites/:ideaId
 */
export const removeFavorite = async (req, res, next) => {
    try {
        const { ideaId } = req.params;
        
        const result = await Favorite.findOneAndDelete({
            idea: ideaId,
            user: req.user.id,
        });

        res.status(204).json({
            status: "success",
            data: null,
        });
    } catch (error) {
        next(error);
    }
};
