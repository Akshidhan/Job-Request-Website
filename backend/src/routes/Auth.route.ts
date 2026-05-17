const route = require("express").Router();
const authController = require("../controllers/Auth.controller");

route.post("/login", authController.login);
route.post("/register", authController.register);

module.exports = route;