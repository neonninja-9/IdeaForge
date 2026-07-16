/**
 * Token Configuration
 * -------------------
 * Centralizes all JWT-related constants.
 * Secrets MUST be set via environment variables in production.
 */

const tokenConfig = Object.freeze({
  access: {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: "15m",
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: "7d",
    cookie: {
      name: "refreshToken",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      path: "/api/v1/auth",
    },
  },
});

export default tokenConfig;
