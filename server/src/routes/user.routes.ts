import express from "express";
import {
  approveUserHandler,
  deleteUserHandler,
  getAllUsersHandler,
  getUserHandler,
  updateUserHandler,
} from "../controllers/user.controller";
import {
  updateUserGroupHandler,
  deleteUserGroupHandler,
} from "../controllers/user-group.controller";
import { verifyJwt } from "../utils/jwt";

const router = express.Router();

// FIXME enable when frontend send bearer token
router.use(verifyJwt);

router.route("/").get(getAllUsersHandler);

router
  .route("/:postId")
  .get(getUserHandler)
  .put(updateUserHandler)
  .delete(deleteUserHandler);

router
  .route("/:postId/group")
  .put(updateUserGroupHandler)
  .delete(deleteUserGroupHandler);

router.route("/:userId/approve").put(approveUserHandler);

export default router;
