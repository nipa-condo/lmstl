import { Response } from "express";
import { AppDataSource } from "../ormconfig";
import { Setting } from "../entities/setting.entity";
import { responseErrors } from "../utils/common";
import { OurFile } from "../entities/upload.entity";
import { User } from "../entities/user.entity";
import { Lession } from "../entities/lession.entity";

const settingRepository = AppDataSource.getRepository(Setting);
const ourfileRepository = AppDataSource.getRepository(OurFile);

export const getSettingHandler = async (req: any, res: Response) => {
  try {
    const setting = await settingRepository.findOneBy({
      id: 1,
    });

    if (!setting) {
      return responseErrors(res, 400, "setting not found");
    }

    res.status(200).json({
      status: "success",
      id: setting.id,
      data: {
        setting,
      },
    });
  } catch (err: any) {
    return responseErrors(res, 400, err);
  }
};

export const updateSettingHandler = async (req: any, res: Response) => {
  const input = req.body;

  const settings = await settingRepository.findOneBy({
    id: 1,
  });

  if (!settings) {
    return responseErrors(res, 400, "setting not found");
  }

  // image session
  settings.home_photo_url = input.home_photo_url;
  settings.sign_in_photo_url = input.sign_in_photo_url;
  settings.register_photo_url = input.register_photo_url;
  settings.place_holder_url = input.place_holder_url;

  // label session
  settings.home_title = input.home_title;
  settings.home_subtitle = input.home_subtitle;
  settings.sign_in_title = input.sign_in_title;
  settings.sign_in_subtitle = input.sign_in_subtitle;
  settings.register_title = input.register_title;
  settings.register_subtitle = input.register_subtitle;
  settings.phone = input.phone;
  settings.location = input.location;
  settings.email = input.email;
  settings.facebook = input.facebook;
  settings.line = input.line;
  settings.copyright = input.copyright;

  let setting = await AppDataSource.manager.save(settings);

  try {
    res.status(200).json({
      status: "success",
      data: {
        setting: setting,
      },
    });
  } catch (err: any) {
    return responseErrors(res, 400, err);
  }
};

export const getOurFileHandler = async (req: any, res: Response) => {
  try {
    const ourfile = await ourfileRepository.find();

    if (!ourfile) {
      return responseErrors(res, 400, "setting not found");
    }

    res.status(200).json({
      status: "success",
      data: {
        setting: ourfile,
      },
    });
  } catch (err: any) {
    return responseErrors(res, 400, err);
  }
};

export const updatedOurFileToNewUrlHandler = async (
  req: any,
  res: Response
) => {
  try {
    const ourfiles = await ourfileRepository.find();

    let resData = ourfiles.map((data) => ({
      id: data.id,
      url: data.url,
      label: data.label,
    }));

    // Respond back after successful CSV creation
    res.status(200).json({
      status: "success",
      data: resData,
    });
  } catch (err: any) {
    console.error(err);
    return responseErrors(res, 400, err.message);
  }
};
