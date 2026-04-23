const { Router } = require("express");
const { getDashboardStats, getAllUsers, getAllTasks } = require("../controllers/admin.controller");
const { verifyJWT, authorizeRoles } = require("../middleware/auth.middleware");
const cacheMiddleware = require("../middleware/cache.middleware");

const router = Router();

router.use(verifyJWT, authorizeRoles("admin")); // Admin-only protection

router.route("/dashboard").get(cacheMiddleware(120), getDashboardStats); // Cache dashboard for 2 minutes
router.route("/users").get(getAllUsers);
router.route("/tasks").get(getAllTasks);

module.exports = router;
