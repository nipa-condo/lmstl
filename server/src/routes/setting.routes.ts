import express from "express";
import { intentDialogflowsHandler } from "../controllers/chatbot.controller";
import {
  getOurFileHandler,
  getSettingHandler,
  updateSettingHandler,
  updatedOurFileToNewUrlHandler,
} from "../controllers/setting.controller";
import { verifyJwt } from "../utils/jwt";

const router = express.Router();
router.route("/").get(getSettingHandler);

router.use(verifyJwt);

router.route("/").put(updateSettingHandler);
router.route("/chatbot").post(intentDialogflowsHandler);

// Admin get all ourfile data
router.route("/ourfile").get(getOurFileHandler);
router.route("/replace/ourfile").put(updatedOurFileToNewUrlHandler);

export default router;
