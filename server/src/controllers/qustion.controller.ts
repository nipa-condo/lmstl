import { NextFunction, Request, Response } from "express";
import { Lession } from "../entities/lession.entity";
import { Pretest } from "../entities/pretest.entity";

import { AppDataSource } from "../ormconfig";
import { PretestResult } from "../entities/pretest-result.entity";
import { Posttest } from "../entities/posttest.entity";
import { pickBy } from "lodash";
import { User } from "../entities/user.entity";
import { PosttestResult } from "../entities/posttest-result.entity";
import { responseErrors } from "../utils/common";

/* Getting the posttest repository from the database. */
const posttestRepository = AppDataSource.getRepository(Posttest);
/* Getting the pretest repository from the database. */
const pretestRepository = AppDataSource.getRepository(Pretest);
/* Getting the lession repository from the database. */
const lessionRepository = AppDataSource.getRepository(Lession);

/* Getting the lession repository from the database. */
const pretestResultRepository = AppDataSource.getRepository(PretestResult);

/* Getting the lession repository from the database. */
const posttestResultRepository = AppDataSource.getRepository(PosttestResult);

export const getAllPretestWithLessionIDHandler = async (
  req: any,
  res: Response
) => {
  try {
    const pretest = await pretestRepository
      .createQueryBuilder("pretest")
      .where("lession_id = :lession_id", {
        lession_id: req.params.postId as any,
      })
      .getMany();

    if (!pretest) {
      return responseErrors(res, 400, "pretest not found");
    }

    res.status(200).json({
      status: "success",
      data: {
        pretest,
      },
    });
  } catch (err: any) {
    return responseErrors(res, 400, err);
  }
};

export const getAllPosttestWithLessionIDHandler = async (
  req: any,
  res: Response
) => {
  try {
    const posttest = await posttestRepository
      .createQueryBuilder("pretest")
      .where("lession_id = :lession_id", {
        lession_id: req.params.postId as any,
      })
      .getMany();

    if (!posttest) {
      return responseErrors(res, 400, "posttest not found");
    }

    res.status(200).json({
      status: "success",
      data: {
        posttest,
      },
    });
  } catch (err: any) {
    return responseErrors(res, 400, err);
  }
};

export const getSingleLessionRelatedPreAndPostTest = async (lssId: any) => {
  const lession = await lessionRepository.findOneBy({
    id: lssId as any,
  });

  if (!lession) {
    throw "lession with that ID not found";
  }

  const pretest = await pretestRepository
    .createQueryBuilder("pretest")
    .where("lession_id = :lession_id", {
      lession_id: lession?.id,
    })
    .getMany();

  const posttest = await posttestRepository
    .createQueryBuilder("posttest")
    .where("lession_id = :lession_id", {
      lession_id: lession?.id,
    })
    .getMany();

  lession!.pretests = pretest;
  lession!.posttests = posttest;

  return lession;
};

export const createPretestResult = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const input = req.body;

    await checkUserAlreadyDoPreTest(req.params.postId, userId);
    const lession = await getSingleLessionRelatedPreAndPostTest(
      req.params.postId
    );

    let preResults: PretestResult[] = [];

    lession.pretests.forEach((pt: Pretest) => {
      input.pretests.forEach((inPt: any) => {
        if (pt.id === inPt.id) {
          let isCorrect = inPt.answer === pt.correct_answer;
          let labelAnswer = "";

          switch (inPt.answer) {
            case "1":
              labelAnswer = pt.answer_1;
              break;

            case "2":
              labelAnswer = pt.answer_2;
              break;

            case "3":
              labelAnswer = pt.answer_3;
              break;

            case "4":
              labelAnswer = pt.answer_4;
              break;
          }

          preResults.push({
            answer_choosed: inPt.answer,
            label_answer_choosed: labelAnswer,
            is_answer_correct: isCorrect,
            user: { id: userId } as User,
            pretest: { id: pt.id } as Pretest,
          } as PretestResult);
        }
      });
    });

    await pretestResultRepository.save(preResults);

    res.status(200).json({
      status: "success",
      data: {
        lession,
      },
    });
  } catch (err: any) {
    return responseErrors(res, 400, err);
  }
};

export const getPretestResult = async (req: any, res: Response) => {
  const userId = req.user.id;
  try {
    const pretestResult = await pretestResultRepository
      .createQueryBuilder("pretest_result")
      .leftJoinAndSelect("pretest_result.pretest", "pretest")
      .leftJoin("pretest.lession", "lession")
      .where("lession.id = :id", { id: req.params.postId })
      .andWhere("pretest_result.user_id = :userId", { userId: userId })
      .getMany();

    let result = {
      total_correct: 0,
      total_incorrect: 0,
    };

    pretestResult.forEach((r) => {
      if (r.is_answer_correct) {
        result.total_correct += 1;
      } else {
        result.total_incorrect += 1;
      }
    });

    res.status(200).json({
      status: "success",
      data: {
        pretestResults: pretestResult,
        summary: result,
      },
    });
  } catch (err: any) {
    return responseErrors(res, 400, err);
  }
};

export const createPosttestResult = async (req: any, res: Response) => {
  try {
    // FIXME use req context after login
    const userId = req.user.id;
    const input = req.body;

    await checkUserAlreadyDoPostTest(req.params.postId, userId);
    const lession = await getSingleLessionRelatedPreAndPostTest(
      req.params.postId
    );

    let postResults: PosttestResult[] = [];

    lession.posttests.forEach((pt: Posttest) => {
      input.posttests.forEach((inPt: any) => {
        if (pt.id === inPt.id) {
          let isCorrect = inPt.answer === pt.correct_answer;
          let labelAnswer = "";

          switch (inPt.answer) {
            case "1":
              labelAnswer = pt.answer_1;
              break;

            case "2":
              labelAnswer = pt.answer_2;
              break;

            case "3":
              labelAnswer = pt.answer_3;
              break;

            case "4":
              labelAnswer = pt.answer_4;
              break;
          }

          postResults.push({
            answer_choosed: inPt.answer,
            label_answer_choosed: labelAnswer,
            is_answer_correct: isCorrect,
            user: { id: userId } as User,
            posttest: { id: pt.id } as Posttest,
          } as PosttestResult);
        }
      });
    });

    await posttestResultRepository.save(postResults);

    res.status(200).json({
      status: "success",
      data: {
        lession,
      },
    });
  } catch (err: any) {
    return responseErrors(res, 400, err);
  }
};

export const getPosttestResult = async (req: any, res: Response) => {
  // FIXME use req context after login
  const userId = req.user.id;
  try {
    const posttestResult = await posttestResultRepository
      .createQueryBuilder("posttest_result")
      .leftJoinAndSelect("posttest_result.posttest", "posttest")
      .leftJoin("posttest.lession", "lession")
      .where("lession.id = :id", { id: req.params.postId })
      .andWhere("posttest_result.user_id = :userId", { userId: userId })
      .getMany();

    let result = {
      total_correct: 0,
      total_incorrect: 0,
    };

    posttestResult.forEach((r) => {
      if (r.is_answer_correct) {
        result.total_correct += 1;
      } else {
        result.total_incorrect += 1;
      }
    });

    res.status(200).json({
      status: "success",
      data: {
        posttestResults: posttestResult,
        summary: result,
      },
    });
  } catch (err: any) {
    return responseErrors(res, 400, err);
  }
};

export const checkUserAlreadyDoPreTest = async (lssId: any, userId: any) => {
  try {
    const pretestResult = await pretestResultRepository
      .createQueryBuilder("pretest_result")
      .leftJoin("pretest_result.pretest", "pretest")
      .leftJoin("pretest.lession", "lession")
      .where("lession.id = :id", { id: lssId })
      .andWhere("pretest_result.user_id = :userId", { userId: userId })
      .getMany();

    if (pretestResult.length > 0) {
      throw "error user already do pretest";
    }

    // return;
  } catch (err: any) {
    throw err;
  }
};

export const checkUserAlreadyDoPostTest = async (lssId: any, userId: any) => {
  try {
    const posttestResult = await posttestResultRepository
      .createQueryBuilder("posttest_result")
      .leftJoin("posttest_result.posttest", "posttest")
      .leftJoin("posttest.lession", "lession")
      .where("lession.id = :id", { id: lssId })
      .andWhere("posttest_result.user_id = :userId", { userId: userId })
      .getMany();

    if (posttestResult.length > 0) {
      throw "error user already do pretest";
    }

    // return;
  } catch (err: any) {
    throw err;
  }
};
