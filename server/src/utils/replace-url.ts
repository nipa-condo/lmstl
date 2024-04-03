import { Request, Response } from "express";
import { AppDataSource } from "../ormconfig";
import { responseErrors } from "./common";
import { OurFile } from "../entities/upload.entity";

const outFileRepository = AppDataSource.getRepository(OurFile);


export const getURLLessions = async (req: any, res: Response) => {
  try {
    // const [users, settings, lessons] = await Promise.all([
    //   userRepository.createQueryBuilder("user")
    //   .where("user.photo_url IS NOT NULL AND user.photo_url <> ''")
    //   .getMany(),
      
    //   settingRepository.createQueryBuilder("setting")
    //     .where("setting.home_photo_url IS NOT NULL AND setting.home_photo_url <> ''")
    //     .orWhere("setting.sign_in_photo_url IS NOT NULL AND setting.sign_in_photo_url <> ''")
    //     .orWhere("setting.register_photo_url IS NOT NULL AND setting.register_photo_url <> ''")
    //     .getMany(),
    //   lessionRepository.createQueryBuilder("lesson")
    //     .where(`
    //       lesson.photo_url IS NOT NULL AND lesson.photo_url <> '' OR
    //       lesson.thumbnail_url IS NOT NULL AND lesson.thumbnail_url <> '' OR
    //       lesson.video_url IS NOT NULL AND lesson.video_url <> '' OR
    //       lesson.files_url_1 IS NOT NULL AND lesson.files_url_1 <> '' OR
    //       lesson.files_url_2 IS NOT NULL AND lesson.files_url_2 <> '' OR
    //       lesson.files_url_3 IS NOT NULL AND lesson.files_url_3 <> ''
    //     `)
    //     .getMany(),
    // ]);

    const ourfiles = await outFileRepository
      .createQueryBuilder("our")
      .where("our.url IS NOT NULL AND our.url <> ''")
      .orWhere("our.label IS NOT NULL AND our.label  <> ''")
      .getMany()
    
    const dataStorage = req.body;

    let dataLabel = [];

      ourfiles.forEach(entity => {
        const isReadable = /^[\x00-\x7F]*$/.test(entity["label"]);

        if (dataStorage[entity["url"]]) {
          const data = {
            label: isReadable ? entity["label"] : "unknown",
            url: dataStorage[entity["url"]],
            oldurl: entity["url"] 
          }
          dataLabel.push(data)
      }
    }
    )

    // users.forEach(user => updateEntityUrls(user, dataLabel ,));
    // settings.forEach(setting => updateEntityUrls(setting, dataLabel));
    // lessons.forEach(lesson => updateEntityUrls(lesson, dataLabel));

    // const savedEntities = await ([
    //   ...users.map(user => userRepository.save(user)),
    //   ...settings.map(setting => settingRepository.save(setting)),
    //   ...lessons.map(lesson => lessionRepository.save(lesson))
    // ])
    

    res.status(200).json({
      status: "success",
      results: dataLabel.length,
      data: dataLabel,
    });

    
  } catch (err: any) {
    return responseErrors(res, 400, err.message);
  }

};

// function updateEntityUrls(entity, dataLabel) {
//   const touchKeys = [
//     "photo_url", "thumbnail_url", "video_url",
//     "files_url_1", "files_url_2", "files_url_3",
//     "home_photo_url", "sign_in_photo_url", "register_photo_url"
//   ];

//   touchKeys.forEach(key => {
//     let urlParts = String(entity[key]).split('/');
//     let urlUpdated = false;

//     let isYouTubeURL = urlParts[2] === "www.youtube.com";

//     dataLabel.forEach(data => {
//       if (entity[key] === data.oldurl) {
//         entity[key] = data.url;
//         entity[`${key}_label`] = data.label;
//         urlUpdated = true;
//       }
//     });

//     if (!urlUpdated && !isYouTubeURL) {
//       entity[key] = null;
//       entity[`${key}_label`] = null;
//     }
//   });
// }

// function awit(arg0: (Promise<User> | Promise<Setting> | Promise<Lession>)[]) {
//   throw new Error("Function not implemented.");
// }
