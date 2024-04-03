import { NextFunction, Request, Response } from "express";
import { Lession } from "../entities/lession.entity";
import { PosttestResult } from "../entities/posttest-result.entity";
import { PretestResult } from "../entities/pretest-result.entity";
import { User } from "../entities/user.entity";
import { responseErrors } from "../utils/common";
import { AppDataSource } from "../ormconfig";
import bcrypt from "bcryptjs";
import { Pretest } from "../entities/pretest.entity";
import { Posttest } from "../entities/posttest.entity";
import { ChatbotAsked } from "../entities/chatbot-asked.entity";
import { UserGroup } from "../entities/user-group.entity";

const userRepository = AppDataSource.getRepository(User);

/* Getting the lession repository from the database. */
const lessionRepository = AppDataSource.getRepository(Lession);

/* Getting the lession repository from the database. */
const pretestResultRepository = AppDataSource.getRepository(PretestResult);

/* Getting the lession repository from the database. */
const posttestResultRepository = AppDataSource.getRepository(PosttestResult);

/* Getting the pretest repository from the database. */
const pretestRepository = AppDataSource.getRepository(Pretest);
/* Getting the posttest repository from the database. */
const posttestRepository = AppDataSource.getRepository(Posttest);

/* Getting the chatbotasked repository from the database. */
const chatbotAskedRepository = AppDataSource.getRepository(ChatbotAsked);

export const registerUserHandler = async (req: any, res: Response) => {
  try {
    const { email, password } = req.body;

    const newUser = await userRepository.save(
      userRepository.create({
        email: email.toLowerCase(),
        password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        class: req.body.class,
        class_number: req.body.class_number,
        role: req.body.role,
        photo_url: req.body.photo_url,
        verified: false,
      })
    );

    await newUser.save();

    try {
      res.status(200).json({
        status: "success",
        id: newUser.id,
        message:
          "An email with a verification has been sent to please wait for admin",
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "There was an error sending verification, please try again",
      });
    }
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({
        status: "fail",
        message: "User with that email already exist",
      });
    }
    return responseErrors(res, 400, err);
  }
};

export const getAllUsersHandler = async (req: any, res: Response) => {
  try {
    // const users = await userRepository.createQueryBuilder("users").getMany();
    const users = await userRepository
      .createQueryBuilder("users")
      .select([
        "users.id AS id",
        "users.created_at AS created_at",
        "users.updated_at AS updated_at",
        "users.email AS email",
        "users.role AS role",
        "users.photo_url AS photo_url",
        "users.firstname AS firstname",
        "users.lastname AS lastname",
        "users.class AS class",
        "users.class_number AS class_number",
        "users.verified AS verified",
        "users.group AS group",
        "CAST((SELECT SUM(chatbot_asked) FROM chatbot_asked WHERE user_id = users.id) AS INTEGER) AS chatbot_asked_total",
      ])
      .orderBy("users.group", "ASC", "NULLS LAST")
      .getRawMany();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
  } catch (err: any) {
    return responseErrors(res, 400, err);
  }
};

export const getUserHandler = async (req: any, res: Response) => {
  try {
    const users = await userRepository
      .createQueryBuilder("users")
      .select([
        "users.id AS id",
        "users.created_at AS created_at",
        "users.updated_at AS updated_at",
        "users.email AS email",
        "users.role AS role",
        "users.photo_url AS photo_url",
        "users.firstname AS firstname",
        "users.lastname AS lastname",
        "users.class AS class",
        "users.class_number AS class_number",
        "users.verified AS verified",
        "users.group AS group",
      ])
      .where("users.id = :id", { id: req.params.postId })
      .getRawOne();

    if (!users) {
      return responseErrors(res, 400, "User not found");
    }

    const lss = await getLessionByUser(+req.params.postId);
    users["lessions"] = lss;

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (err: any) {
    return responseErrors(res, 400, err);
  }
};

export const updateUserHandler = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const input = req.body;

    const users = await userRepository.findOneBy({
      id: req.params.postId as any,
    });

    if (!users) {
      return responseErrors(res, 400, "User not found");
    }

    users.photo_url = input.photo_url;

    users.email = input.email;
    users.role = input.role;
    users.photo_url = input.photo_url;
    users.firstname = input.firstname;
    users.lastname = input.lastname;
    users.class = input.class;
    users.class_number = input.class_number;
    users.verified = input.verified;
    users.group = input.group;

    if (users.group === "") {
      users.group = null;
    }

    if (input.password && input.password !== "") {
      users.password = await bcrypt.hash(input.password, 12);
    }

    const updatedUsers = await userRepository.save(users);

    res.status(200).json({
      status: "success",
      data: {
        users: updatedUsers,
      },
    });
  } catch (err: any) {
    return responseErrors(res, 400, "Can't update your user");
  }
};

export const deleteUserHandler = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userRepository.findOneBy({
      id: req.params.postId as any,
    });

    if (!users) {
      return responseErrors(res, 400, "User not found");
    }

    await users.remove();

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err: any) {
    return responseErrors(res, 400, "Can't delete your user");
  }
};

export const approveUserHandler = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userRepository.findOneBy({
      id: req.params.userId,
    } as any);

    if (!user) {
      return responseErrors(res, 400, "User not found");
    }

    user.verified = true;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "verified successfully",
    });
  } catch (err: any) {
    return responseErrors(res, 400, "Can't delete your user");
  }
};

async function getLessionByUser(userId: number) {
  const lessions = await lessionRepository
    .createQueryBuilder("lession")
    .where("active IS TRUE")
    .getMany();

  const newLessions = [];

  for (let l of lessions) {
    const pretestCount = await pretestRepository
      .createQueryBuilder("pretest")
      .leftJoin("pretest.lession", "lession")
      .where("lession.id = :id", { id: l.id })
      .getCount();

    const posttestCount = await posttestRepository
      .createQueryBuilder("posttest")
      .leftJoin("posttest.lession", "lession")
      .where("lession.id = :id", { id: l.id })
      .getCount();

    const pretestResults = await pretestResultRepository
      .createQueryBuilder("pretest_result")
      .leftJoin("pretest_result.pretest", "pretest")
      .leftJoin("pretest.lession", "lession")
      .where("lession.id = :id", { id: l.id })
      .andWhere("pretest_result.user_id = :userId", { userId: userId })
      .andWhere("pretest_result.is_answer_correct IS TRUE")
      .getMany();

    const posttestResults = await posttestResultRepository
      .createQueryBuilder("posttest_result")
      .leftJoin("posttest_result.posttest", "posttest")
      .leftJoin("posttest.lession", "lession")
      .where("lession.id = :id", { id: l.id })
      .andWhere("posttest_result.user_id = :userId", { userId: userId })
      .andWhere("posttest_result.is_answer_correct IS TRUE")
      .getMany();

    const chatbotAsked = await chatbotAskedRepository
      .createQueryBuilder("chatbot_asked")
      .where("chatbot_asked.user_id = :userId", { userId: userId })
      .andWhere("chatbot_asked.lession_id = :lessionId", { lessionId: l.id })
      .getOne();

    const result = {
      created_at: l.created_at,
      id: l.id,
      title: l.title,
      subtitle: l.subtitle,
      content: l.content,
      have_pretest: l.have_pretest,
      have_content: l.have_content,
      have_posttest: l.have_posttest,
      have_result: l.have_result,
      is_random: l.is_random,
      is_video_from: l.is_video_from,
      photo_url: l.photo_url,
      thumbnail_url: l.thumbnail_url,
      video_url: l.video_url,
      files_url_1: l.files_url_1,
      files_url_2: l.files_url_2,
      files_url_3: l.files_url_3,
      pretest: {
        correct: pretestResults.length,
        total: pretestCount,
      },
      posttest: {
        correct: posttestResults.length,
        total: posttestCount,
      },
      chatbot_asked: chatbotAsked ? chatbotAsked.chatbot_asked : 0,
    };

    newLessions.push(result);
  }

  return newLessions;
}
