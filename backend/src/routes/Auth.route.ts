const route = require("express").Router();
const authController = require("../controllers/Auth.controller");
const { authenticateUser } = require("../middleware/UserAuth.middleware");

route.post("/login", authController.login);
route.post("/register", authController.register);
route.get("/me", authenticateUser, authController.getCurrentUser);
route.post("/logout", authController.logout);

module.exports = route;