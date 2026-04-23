const { Router } = require("express");
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");
const { verifyJWT } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { createTask: createTaskVal, updateTask: updateTaskVal } = require("../validations/task.validation");

const router = Router();

router.use(verifyJWT); // Protect all task routes

router.route("/")
  .get(getAllTasks)
  .post(validate(createTaskVal), createTask);

router.route("/:id")
  .get(getTaskById)
  .patch(validate(updateTaskVal), updateTask)
  .delete(deleteTask);

module.exports = router;
