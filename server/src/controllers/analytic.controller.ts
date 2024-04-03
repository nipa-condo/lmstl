import { Response } from "express";
import { Posttest } from "../entities/posttest.entity";

import { Lession } from "../entities/lession.entity";
import { Pretest } from "../entities/pretest.entity";
import { AppDataSource } from "../ormconfig";
import { OurFile } from "../entities/upload.entity";
import { PosttestResult } from "../entities/posttest-result.entity";
import { PretestResult } from "../entities/pretest-result.entity";
import { User } from "../entities/user.entity";
import { responseErrors } from "../utils/common";

/* Getting the lession repository from the database. */
const lessionRepository = AppDataSource.getRepository(Lession);
/* Getting the pretest repository from the database. */
const pretestRepository = AppDataSource.getRepository(Pretest);
/* Getting the posttest repository from the database. */
const posttestRepository = AppDataSource.getRepository(Posttest);
/* Getting the repository for the OurFile class. */
const fileUploadedRepository = AppDataSource.getRepository(OurFile);
/* Getting the lession repository from the database. */
const pretestResultRepository = AppDataSource.getRepository(PretestResult);
/* Getting the lession repository from the database. */
const posttestResultRepository = AppDataSource.getRepository(PosttestResult);
/* Getting the lession repository from the database. */
const userRepository = AppDataSource.getRepository(User);

export const getAdminAnalyticLessionHandler = async (
  req: any,
  res: Response
) => {
  try {
    const input = req.query;

    const lessionQuery = lessionRepository
      .createQueryBuilder("lession")
      .where("active IS TRUE");

    if (input.sort_by) {
      const sorting =
        (input.sort as string).toUpperCase() === "DESC" ? "DESC" : "ASC";

      if (input.sort_by === "id") {
        lessionQuery.orderBy("lession.id", sorting, "NULLS LAST");
      } else {
        lessionQuery.orderBy(`lession.${input.sort_by}`, sorting);
      }
    } else {
      lessionQuery.orderBy({
        "lession.order": {
          order: "ASC",
          nulls: "NULLS LAST",
        },
      });
    }

    const lessions = await lessionQuery.getMany();

    const totalUser = await userRepository
      .createQueryBuilder("user")
      .where("role != :role", { role: "admin" })
      .getCount();

    let result = [];

    for (let l of lessions) {
      const pretest = await pretestRepository
        .createQueryBuilder("pretest")
        .where("lession_id = :lession_id", {
          lession_id: l?.id,
        })
        .getMany();

      const posttest = await posttestRepository
        .createQueryBuilder("posttest")
        .where("lession_id = :lession_id", {
          lession_id: l?.id,
        })
        .getMany();

      const pretestUser = await pretestResultRepository
        .createQueryBuilder("pretest_result")
        .leftJoinAndSelect("pretest_result.user", "user")
        .leftJoin("pretest_result.pretest", "pretest")
        .leftJoin("pretest.lession", "lession")
        .where("lession.id = :id", { id: l.id })
        .getMany();

      const posttestUser = await posttestResultRepository
        .createQueryBuilder("posttest_result")
        .leftJoinAndSelect("posttest_result.user", "user")
        .leftJoin("posttest_result.posttest", "posttest")
        .leftJoin("posttest.lession", "lession")
        .where("lession.id = :id", { id: l.id })
        .getMany();

      const preUserList = pretestUser.map((d) => d.user.id);
      const postUserList = posttestUser.map((d) => d.user.id);

      const merged = [...preUserList, ...postUserList];
      const unique = [...new Set(merged)];
      const totalTestUser = unique.length;
      const total_user = (totalTestUser / totalUser) * 100;

      const pretestCorrect = pretestUser.filter(
        (d) => d.is_answer_correct
      ).length;
      const pretestInCorrect = pretestUser.filter(
        (d) => !d.is_answer_correct
      ).length;
      const posttestCorrect = posttestUser.filter(
        (d) => d.is_answer_correct
      ).length;
      const posttestInCorrect = posttestUser.filter(
        (d) => !d.is_answer_correct
      ).length;

      result.push({
        count_user: totalUser,
        count_score: pretest.length || posttest.length,
        lession: l,
        total_user: Math.round(total_user),
        over_all_user: totalTestUser,
        total_test_user: {
          percent: Math.round(total_user),
          value: totalTestUser,
        },
        total_not_test_user: {
          value: totalUser - totalTestUser,
          percent: Math.round(((totalUser - totalTestUser) / totalUser) * 100),
        },
        total_correct: {
          pretest: pretestCorrect,
          pretest_percent: Math.round(
            (pretestCorrect / pretestUser.length) * 100
          ),
          posttest: posttestCorrect,
          posttest_percent: Math.round(
            (posttestCorrect / posttestUser.length) * 100
          ),
          average: pretestCorrect + posttestCorrect,
          average_percent: Math.round(
            ((pretestCorrect + posttestCorrect) /
              (pretestUser.length + posttestUser.length)) *
              100
          ),
          average_user: Math.round(
            (pretestCorrect + posttestCorrect) / totalTestUser
          ),
        },
        total_incorrect: {
          pretest: pretestInCorrect,
          pretest_percent: Math.round(
            (pretestInCorrect / pretestUser.length) * 100
          ),
          posttest: posttestInCorrect,
          posttest_percent: Math.round(
            (posttestInCorrect / posttestUser.length) * 100
          ),
          average: pretestInCorrect + posttestInCorrect,
          average_percent: Math.round(
            ((pretestInCorrect + posttestInCorrect) /
              (pretestUser.length + posttestUser.length)) *
              100
          ),
          average_user: Math.round(
            (pretestInCorrect + posttestInCorrect) / totalTestUser
          ),
        },
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        result,
      },
    });
  } catch (err: any) {
    return responseErrors(res, 500, err);
  }
};

export const getUserAnalyticLessionHandler = async (
  req: any,
  res: Response
) => {
  const userId = req.user.id;

  try {
    const lessions = await lessionRepository
      .createQueryBuilder("lession")
      .where("active IS TRUE")
      .getMany();

    let result = [];

    for (let l of lessions) {
      const pretestCorrect = await pretestResultRepository
        .createQueryBuilder("pretest_result")
        .select("COUNT(pretest_result.id) AS pretest_correct")
        .leftJoin("pretest_result.pretest", "pretest")
        .leftJoin("pretest.lession", "lession")
        .where("lession.id = :id", { id: l.id })
        .andWhere("pretest_result.user_id = :userId", { userId: userId })
        .andWhere("pretest_result.is_answer_correct IS TRUE")
        .getRawOne();

      const pretestInCorrect = await pretestResultRepository
        .createQueryBuilder("pretest_result")
        .select("COUNT(pretest_result.id) AS pretest_incorrect")
        .leftJoin("pretest_result.pretest", "pretest")
        .leftJoin("pretest.lession", "lession")
        .where("lession.id = :id", { id: l.id })
        .andWhere("pretest_result.user_id = :userId", { userId: userId })
        .andWhere("pretest_result.is_answer_correct IS FALSE")
        .getRawOne();

      const posttestCorrect = await posttestResultRepository
        .createQueryBuilder("posttest_result")
        .select("COUNT(posttest_result.id) AS posttest_correct")
        .leftJoin("posttest_result.posttest", "posttest")
        .leftJoin("posttest.lession", "lession")
        .where("lession.id = :id", { id: l.id })
        .andWhere("posttest_result.user_id = :userId", { userId: userId })
        .andWhere("posttest_result.is_answer_correct IS TRUE")
        .getRawOne();

      const posttestInCorrect = await posttestResultRepository
        .createQueryBuilder("posttest_result")
        .select("COUNT(posttest_result.id) AS posttest_incorrect")
        .leftJoin("posttest_result.posttest", "posttest")
        .leftJoin("posttest.lession", "lession")
        .where("lession.id = :id", { id: l.id })
        .andWhere("posttest_result.user_id = :userId", { userId: userId })
        .andWhere("posttest_result.is_answer_correct IS FALSE")
        .getRawOne();

      result.push({
        lession: l,
        pretest_correct: +pretestCorrect["pretest_correct"],
        pretest_incorrect: +pretestInCorrect["pretest_incorrect"],
        posttest_correct: +posttestCorrect["posttest_correct"],
        posttest_incorrect: +posttestInCorrect["posttest_incorrect"],
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        result,
      },
    });
  } catch (err: any) {
    return responseErrors(res, 400, "Can't get data for analytics");
  }
};
