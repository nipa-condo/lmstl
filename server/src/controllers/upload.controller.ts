import path from "path";
import fs from "fs";
import uuid from "../utils/uuid";
import multer from "multer";
import { OurFile } from "../entities/upload.entity";
import { AppDataSource } from "../ormconfig";
import { Response } from "express";
import { responseErrors } from "../utils/common";
import { Storage } from "@google-cloud/storage";

const fileUploadedRepository = AppDataSource.getRepository(OurFile);

const base64Key = process.env.GOOGLE_CREDENTIALS as string;
const bucketName = process.env.GOOGLE_BUCKET_NAME as string;
const keyBuffer = Buffer.from(base64Key, "base64");
const storage = new Storage({
  credentials: JSON.parse(keyBuffer.toString()),
});

const bucket = storage.bucket(bucketName);

export const uploadController = async (req: any, res: Response) => {
  try {
    const file = req.file;
    const type = req.body.type;
    let urlfile = "";
    let ext = "";
    let generateName = "";

    // file type in system
    const extImage = ["png", "jpg", "gif", "jpeg"];
    const extVideo = ["mp4", "ogg", "webm", "x-m4v", "avi", "mpeg"];

    if (!file && !file.originalname) {
      return responseErrors(res, 400, "File not found");
    }

    switch (type) {
      case "image":
        ext = file.mimetype.split("/")[1].toLowerCase();
        if (!extImage.includes(ext)) {
          return responseErrors(res, 400, "Invalid file ext type");
        }

        if (file.size > 1024 * 1024 * 4) {
          return responseErrors(res, 400, "This File is over 4mb");
        }
        break;

      case "video":
        ext = file.mimetype.split("/")[1].toLowerCase();
        if (!extVideo.includes(ext)) {
          return responseErrors(res, 400, "Invalid file ext type");
        }

        if (file.size > 1024 * 1024 * 1024) {
          return responseErrors(res, 400, "This File is over 1gb");
        }
        break;

      case "file":
        if (file.size > 1024 * 1024 * 1024) {
          return responseErrors(res, 400, "This File is over 1gb");
        }
        break;
    }

    generateName = `${uuid()}-${Date.now()}-${file.originalname}`;

    const blob = bucket.file(generateName);
    await blob.save(file.buffer, {
      metadata: { contentType: file.mimetype },
    });
    urlfile = `${process.env.URL_GOOGLE_STORAGE as string}/${generateName}`;

    return res.status(200).json({
      status: "success",
      message: "File uploaded successfully",
      url: urlfile,
      label: file.originalname
    });

  } catch (err: any) {
    return responseErrors(res, 500, "Failed to upload the file with : " + err);
  }
};

export const uploadData = multer({
  storage: multer.memoryStorage(),
});

const uploadFilesSequentially = async (files: any, res: any) => {
  const uploadedFiles = [];
  for (const file of files) {

    if (!file && !file.originalname) {
      return responseErrors(res, 400, "File not found");
    }
    
    if (file.size > 1024 * 1024 * 1024) {
      return responseErrors(res, 400, "This File is over 1gb");
    }

    const generateName = `${uuid()}-${Date.now()}-${file.originalname}`;
    const fileName = `${generateName}`;

    const blob = bucket.file(fileName);

    await blob.save(file.buffer, {
      metadata: { contentType: file.mimetype },
    });

    uploadedFiles.push({
      url: `${process.env.URL_GOOGLE_STORAGE as string}/${generateName}`,
      label: file.originalname
    });
  }

  return uploadedFiles;
};

export const uploadMultiController = async (req: any, res: Response) => {
  try {
    const reqFiles = req.files;

    if (!reqFiles || reqFiles.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Unable to upload file",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "File uploaded successfully",
      files: await uploadFilesSequentially(req.files.file, res),
    });
    
  } catch (err: any) {
    return res.status(500).json({
      status: "fail",
      message: "Failed to upload the file",
    });
  }
};

export const uploadML = multer({
  storage: multer.memoryStorage(),
});

export const getUploadHandler = async (req: any, res: Response) => {
  try {
    const file = await fileUploadedRepository.findOneBy({
      url: req.params.fileId,
    });

    if (!file) {
      return responseErrors(res, 400, "Upload file not found");
    }

    const fileType = file.url.split("-")[0];

    let resUpload = "";

    switch (fileType) {
      case "image":
        resUpload = path.resolve("./") + "/public/uploaded/images/" + file.url;
        break;

      case "file":
        resUpload = path.resolve("./") + "/public/uploaded/files/" + file.url;
        break;

      case "video":
        resUpload = path.resolve("./") + "/public/uploaded/videos/" + file.url;
        break;

      default:
        resUpload = path.resolve("./") + "/public/default/" + file.url;
        break;
    }

    res.status(200).sendFile(resUpload);
  } catch (err: any) {
    return responseErrors(res, 400, err);
  }
};

export const getAllUploadHandler = async (req: any, res: Response) => {
  try {
    const uploaded = await fileUploadedRepository.find();

    res.status(200).json({
      status: "success",
      results: uploaded.length,
      data: uploaded,
    });
  } catch (err: any) {
    return responseErrors(res, 400, err);
  }
};

export const deleteUploadHandler = async (req: any, res: Response) => {
  try {
    const file = await fileUploadedRepository.findOneBy({
      url: req.params.fileId,
    });

    if (!file) {
      return responseErrors(res, 400, "Upload file not found");
    }

    await file.remove();

    const fileType = file.url.split("-")[0];
    let filePath = "";

    switch (fileType) {
      case "image":
        filePath = path.resolve("./") + "/public/uploaded/images/" + file.url;
        break;

      case "file":
        filePath = path.resolve("./") + "/public/uploaded/files/" + file.url;
        break;

      case "video":
        filePath = path.resolve("./") + "/public/uploaded/videos/" + file.url;
        break;
    }

    if (!fs.existsSync(filePath)) {
      res.status(204).json({
        status: "success",
        data: "delete files success",
      });
    }

    fs.unlinkSync(filePath);

    res.status(204).json({
      status: "success",
      data: "delete files success",
    });
  } catch (err: any) {
    return responseErrors(res, 400, err);
  }
};
