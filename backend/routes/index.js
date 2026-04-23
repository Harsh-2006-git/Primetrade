const { Router } = require("express");
const authRouter = require("./auth.routes");
const taskRouter = require("./task.routes");
const adminRouter = require("./admin.routes");

const router = Router();

router.use("/auth", authRouter);
router.use("/tasks", taskRouter);
router.use("/admin", adminRouter);

module.exports = router;
