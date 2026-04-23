const { Router } = require("express");
const { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser,
  setupAdmin
} = require("../controllers/auth.controller");
const { verifyJWT } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { register, login } = require("../validations/auth.validation");

const router = Router();

router.route("/register").post(validate(register), registerUser);
router.route("/login").post(validate(login), loginUser);
router.route("/setup-admin").get(setupAdmin);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, getCurrentUser);

module.exports = router;
