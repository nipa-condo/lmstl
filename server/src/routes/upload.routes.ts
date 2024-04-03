import express from "express";
import {
  deleteUploadHandler,
  getAllUploadHandler,
  getUploadHandler,
  uploadController,
  uploadData,
  uploadML,
  uploadMultiController,
} from "../controllers/upload.controller";
import { verifyJwt } from "../utils/jwt";
import { getURLLessions } from "../utils/replace-url";

const router = express.Router();

router.route("/:fileId").get(getUploadHandler);

router.use(verifyJwt);

router.route("/url").post(getURLLessions);
router.route("/files/data").get(getAllUploadHandler);
router.route("/").post(uploadData.single("file"), uploadController);

router
  .route("/multiple")
  .post(
    uploadML.fields([{ name: "file", maxCount: 3 }]),
    uploadMultiController
  );

router.route("/:fileId").delete(deleteUploadHandler);

export default router;
