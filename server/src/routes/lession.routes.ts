import express from "express";
import {
  createLessionHandler,
  deleteLessionHandler,
  getLessionHandler,
  getAllLessionsHandler,
  updateLessionHandler,
  getPretestLessionUserResultHandler,
  getPosttestLessionUserResultHandler,
} from "../controllers/lession.controller";
import { getAllPosttestWithLessionIDHandler } from "../controllers/qustion.controller";
import {
  createPosttestResult,
  createPretestResult,
  getAllPretestWithLessionIDHandler,
  getPosttestResult,
  getPretestResult,
} from "../controllers/qustion.controller";
import { verifyJwt } from "../utils/jwt";

const router = express.Router();

// FIXME enable when frontend send bearer token
router.use(verifyJwt);

router.route("/").post(createLessionHandler).get(getAllLessionsHandler);

router
  .route("/:postId")
  .get(getLessionHandler)
  .put(updateLessionHandler)
  .delete(deleteLessionHandler);

router.route("/pretest/:postId").get(getAllPretestWithLessionIDHandler);
router.route("/posttest/:postId").get(getAllPosttestWithLessionIDHandler);

router
  .route("/:postId/pretest-result")
  .get(getPretestResult)
  .post(createPretestResult);

router
  .route("/:postId/posttest-result")
  .get(getPosttestResult)
  .post(createPosttestResult);

router.route("/:postId/pretest-user").get(getPretestLessionUserResultHandler);
router.route("/:postId/posttest-user").get(getPosttestLessionUserResultHandler);

export default router;
