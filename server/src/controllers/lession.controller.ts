import { Request, Response } from "express";
import { Posttest } from "../entities/posttest.entity";

import { Lession } from "../entities/lession.entity";
import { Pretest } from "../entities/pretest.entity";
import { AppDataSource } from "../ormconfig";
import { OurFile } from "../entities/upload.entity";

import { PosttestResult } from "../entities/posttest-result.entity";
import { PretestResult } from "../entities/pretest-result.entity";
import { responseErrors, shuffle } from "../utils/common";
import { User } from "../entities/user.entity";
import { UserGroup } from "../entities/user-group.entity";
import { ChatbotAsked } from "../entities/chatbot-asked.entity";

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
/* Getting the user repository from the database. */
const userRepository = AppDataSource.getRepository(User);
/* Getting the user group repository from the database. */
const userGroupRepository = AppDataSource.getRepository(UserGroup);
/* Getting the chatbot asked repository from the database. */
const chatbotAskedRepository = AppDataSource.getRepository(ChatbotAsked);

export const createLessionHandler = async (req: any, res: Response) => {
  try {
    const input = req.body;

    let new_lession = {
      title: input.title,
      subtitle: input.subtitle,
      content: input.content,
      have_pretest: input.have_pretest,
      have_content: input.have_content,
      have_posttest: input.have_posttest,
      have_result: input.have_result,
      is_random: input.is_random,
      order: input.order,
      files_url_1: input.files_url_1,
      files_url_2: input.files_url_2,
      files_url_3: input.files_url_3,
      video_url: input.video_url,
      photo_url: input.photo_url,
      thumbnail_url: input.thumbnail_url,
      is_video_from: input.is_video_from,
    } as Lession;

    const lession = await lessionRepository.save(new_lession);

    let pretest;
    if (input.have_pretest) {
      let input_pretest: any = input.pretests;
      let new_pretest: Pretest[] = [];

      for (let i of input_pretest) {
        let pret = {
          question: i.question,
          answer_1: i.answer_1,
          answer_2: i.answer_2,
          answer_3: i.answer_3,
          answer_4: i.answer_4,
          correct_answer: i.correct_answer,
          lession: {
            id: lession.id,
          } as Lession,
        } as Pretest;

        new_pretest.push(pret);
      }
      pretest = await pretestRepository.save(new_pretest);
    }

    let posttest;
    if (input.have_posttest) {
      let input_posttest: any = input.posttests;
      let new_posttest: Posttest[] = [];

      for (let i of input_posttest) {
        let post = {
          question: i.question,
          answer_1: i.answer_1,
          answer_2: i.answer_2,
          answer_3: i.answer_3,
          answer_4: i.answer_4,
          correct_answer: i.correct_answer,
          lession: {
            id: lession.id,
          } as Lession,
        } as Posttest;

        new_posttest.push(post);
      }
      posttest = await posttestRepository.save(new_posttest);
    }

    lession!.pretests = pretest as Pretest[];
    lession!.posttests = posttest as Posttest[];

    res.status(200).json({
      status: "success",
      id: lession.id,
      data: {
        lession,
      },
    });
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({
        status: "fail",
        message: "lession with that title already exist",
      });
    }
    return responseErrors(res, 400, "Can't create lession data");
  }
};

export const getAllLessionsHandler = async (req: any, res: Response) => {
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

    res.status(200).json({
      status: "success",
      results: lessions.length,
      data: lessions,
    });
  } catch (err: any) {
    return responseErrors(res, 400, err.message);
  }
};

export const getLessionHandler = async (req: any, res: Response) => {
  try {
    const lessionData = await lessionRepository.findOneBy({
      id: req.params.postId as any,
      active: true,
    });

    if (!lessionData) {
      return responseErrors(res, 400, "Lession not found");
    }

    const pretest = await pretestRepository
      .createQueryBuilder("pretest")
      .where("lession_id = :lession_id", {
        lession_id: lessionData?.id,
      })
      .getMany();

    const posttest = await posttestRepository
      .createQueryBuilder("posttest")
      .where("lession_id = :lession_id", {
        lession_id: lessionData?.id,
      })
      .getMany();

    lessionData!.pretests = pretest;
    lessionData!.posttests = posttest;

    if (lessionData!.is_random) {
      shuffle(lessionData!.pretests);
      shuffle(lessionData!.posttests);
    }

    const userId = req.user.id;
    let resultTest = {
      is_test_pretest: false,
      is_test_posttest: false,
    };

    const pretestResult = await pretestResultRepository
      .createQueryBuilder("pretest_result")
      .leftJoinAndSelect("pretest_result.pretest", "pretest")
      .leftJoin("pretest.lession", "lession")
      .where("lession.id = :id", { id: lessionData?.id })
      .andWhere("pretest_result.user_id = :userId", { userId: userId })
      .getMany();

    const posttestResult = await posttestResultRepository
      .createQueryBuilder("posttest_result")
      .leftJoinAndSelect("posttest_result.posttest", "posttest")
      .leftJoin("posttest.lession", "lession")
      .where("lession.id = :id", { id: lessionData?.id })
      .andWhere("posttest_result.user_id = :userId", { userId: userId })
      .getMany();

    if (pretestResult.length > 0) {
      resultTest.is_test_pretest = true;
    }

    if (posttestResult.length > 0) {
      resultTest.is_test_posttest = true;
    }

    // let files1;
    // if (lessionData.files_url_1) {
    //   const uploadedData = await fileUploadedRepository.findOneBy({
    //     url: lessionData.files_url_1,
    //   });

    //   files1 = {
    //     label: uploadedData?.label,
    //     type: uploadedData?.type,
    //     url: uploadedData?.url,
    //   };
    // }

    // let files2;
    // if (lessionData.files_url_2) {
    //   const uploadedData = await fileUploadedRepository.findOneBy({
    //     url: lessionData.files_url_2,
    //   });

    //   files2 = {
    //     label: uploadedData?.label,
    //     type: uploadedData?.type,
    //     url: uploadedData?.url,
    //   };
    // }

    // let files3;
    // if (lessionData.files_url_3) {
    //   const uploadedData = await fileUploadedRepository.findOneBy({
    //     url: lessionData.files_url_3,
    //   });

    //   files3 = {
    //     label: uploadedData?.label,
    //     type: uploadedData?.type,
    //     url: uploadedData?.url,
    //   };
    // }

    const lession = {
      id: lessionData.id,
      created_at: lessionData.created_at,
      updated_at: lessionData.updated_at,
      active: lessionData.active,
      title: lessionData.title,
      subtitle: lessionData.subtitle,
      content: lessionData.content,
      have_pretest: lessionData.have_pretest,
      have_content: lessionData.have_content,
      have_posttest: lessionData.have_posttest,
      have_result: lessionData.have_result,
      is_random: lessionData.is_random,
      photo_url: lessionData.photo_url,
      photo_url_label: lessionData.photo_url_label,
      thumbnail_url: lessionData.thumbnail_url,
      thumbnail_url_label: lessionData.thumbnail_url_label,
      video_url: lessionData.video_url,
      video_url_label: lessionData.video_url_label,
      is_video_from: lessionData.is_video_from,
      files_url_1: lessionData.files_url_1,
      files_url_1_label: lessionData.files_url_1_label,
      files_url_2: lessionData.files_url_2,
      files_url_2_label: lessionData.files_url_2_label,
      files_url_3: lessionData.files_url_3,
      files_url_3_label: lessionData.files_url_3_label,
      order: lessionData.order,
      pretests: lessionData.pretests,
      posttests: lessionData.posttests,
    };

    res.status(200).json({
      status: "success",
      id: lessionData.id,
      data: {
        lession,
        result_test: resultTest,
      },
    });
  } catch (err: any) {
    return responseErrors(res, 400, err);
  }
};

export const updateLessionHandler = async (req: any, res: Response) => {
  const input = req.body;

  const lessionData = await lessionRepository
    .createQueryBuilder("lession")
    .where("id = :id", { id: req.params.postId })
    .getOne();

  if (!lessionData) {
    return responseErrors(res, 500, "can't found lession");
  }

  try {

    if (input.photo_url || input.photo_url === null) {
      lessionData.photo_url = input.photo_url;
    }
    if (input.thumbnail_url || input.thumbnail_url === null) {
      lessionData.thumbnail_url = input.thumbnail_url;
    }

    if (input.video_url || input.video_url === null) {
      lessionData.video_url = input.video_url;
    }

    if (input.files_url_1 || input.files_url_1 === null) {
      lessionData.files_url_1 = input.files_url_1;
    }

    if (input.files_url_2 || input.files_url_2 === null) {
      lessionData.files_url_2 = input.files_url_2;
    }

    if (input.files_url_3 || input.files_url_3 === null) {
      lessionData.files_url_3 = input.files_url_3;
    }

    const em = lessionRepository.manager.transaction(async (manager) => {
      lessionData.title = input.title;
      lessionData.subtitle = input.subtitle;
      lessionData.content = input.content;
      lessionData.have_pretest = input.have_pretest;
      lessionData.have_content = input.have_content;
      lessionData.have_posttest = input.have_posttest;
      lessionData.have_result = input.have_result;
      lessionData.is_random = input.is_random;
      lessionData.is_video_from = input.is_video_from;
      lessionData.order = input.order;

      const lession = await manager.save(Lession, lessionData!);

      if (input.have_pretest) {
        const pretest = await updatePretest(req.params.postId, input.pretests);
      }

      if (input.have_posttest) {
        const posttest = await updatePosttest(
          req.params.postId,
          input.posttests
        );
      }
    });

    res.status(200).json({
      status: "success",
      data: {
        lession: lessionData,
      },
    });
  } catch (err: any) {
    return responseErrors(res, 400, err.message);
  }
};

export const updatePretest = async (lssId: any, inPretest: any) => {
  let newPretest: Pretest[] = [];

  const pretests = await pretestRepository
    .createQueryBuilder("pretest")
    .where("lession_id = :lession_id", {
      lession_id: lssId,
    })
    .getMany();

  for (let p1 of pretests) {
    for (let p2 of inPretest) {
      if (p1.id === p2.id) {
        p1.question = p2.question;
        p1.answer_1 = p2.answer_1;
        p1.answer_2 = p2.answer_2;
        p1.answer_3 = p2.answer_3;
        p1.answer_4 = p2.answer_4;
        p1.correct_answer = p2.correct_answer;

        newPretest.push(p1);
      }
    }
  }
  await pretestRepository.save(newPretest);
};

export const updatePosttest = async (lssId: any, inPosttest: any) => {
  let newPosttest: Posttest[] = [];

  const posttests = await posttestRepository
    .createQueryBuilder("posttest")
    .where("lession_id = :lession_id", {
      lession_id: lssId,
    })
    .getMany();

  for (let p1 of posttests) {
    for (let p2 of inPosttest) {
      if (p1.id === p2.id) {
        p1.question = p2.question;
        p1.answer_1 = p2.answer_1;
        p1.answer_2 = p2.answer_2;
        p1.answer_3 = p2.answer_3;
        p1.answer_4 = p2.answer_4;
        p1.correct_answer = p2.correct_answer;

        newPosttest.push(p1);
      }
    }
  }
  await posttestRepository.save(newPosttest);
};

export const deleteLessionHandler = async (req: any, res: Response) => {
  try {
    const lession = await lessionRepository.findOneBy({
      id: req.params.postId as any,
    });

    if (!lession) {
      return responseErrors(res, 400, "Can't found lession");
    }

    if (lession.photo_url) {
      lession.photo_url = null;
    }

    if (lession.thumbnail_url) {
      lession.thumbnail_url = null;
    }

    if (lession.video_url) {
      lession.video_url = null;
    }

    if (lession.files_url_1) {
      lession.files_url_1 = null;
    }

    if (lession.files_url_2) {
      lession.files_url_2 = null;
    }

    if (lession.files_url_3) {
      lession.files_url_3 = null;
    }

    // //FIXME full delete pretest
    // const delPretest = await pretestRepository
    //   .createQueryBuilder()
    //   .delete()
    //   .from(Pretest)
    //   .where("lession_id = :lssId ", {
    //     lssId: req.params.postId,
    //   })
    //   .execute();

    // //FIXME full delete posttest
    // const delPosttest = await posttestRepository
    //   .createQueryBuilder()
    //   .delete()
    //   .from(Posttest)
    //   .where("lession_id = :lssId ", {
    //     lssId: req.params.postId,
    //   })
    //   .execute();

    lession.active = false;

    await lession.save();

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err: any) {
    return responseErrors(res, 400, err);
  }
};

export const getPretestLessionUserResultHandler = async (
  req: any,
  res: Response
) => {
  try {
    const lessionId = req.params.postId;
    const lession = await lessionRepository
      .createQueryBuilder("lession")
      .where("id = :id", { id: lessionId })
      .getOne();

    if (!lession) {
      return responseErrors(res, 400, "Lession not found");
    }

    if (!lession.have_pretest) {
      return res.status(200).json({ status: "success", data: [] });
    }

    // Promise all data
    const [users, pretests, chatbotAsked] = await Promise.all([
      userRepository
        .createQueryBuilder("user")
        .innerJoin(
          PretestResult,
          "pretest_result",
          "pretest_result.user_id = user.id"
        )
        .innerJoin("pretest_result.pretest", "pretest")
        .innerJoin("pretest.lession", "lession")
        .where("lession.id = :lession_id", { lession_id: lession?.id })
        .groupBy("user.id")
        .getMany(),

      pretestRepository
        .createQueryBuilder("pretest")
        .leftJoinAndSelect("pretest.pretestResults", "pretest_result")
        .leftJoinAndSelect("pretest_result.user", "user")
        .where("pretest.lession_id = :lession_id", { lession_id: lession?.id })
        .orderBy("pretest.id", "ASC")
        .getMany(),

      chatbotAskedRepository
        .createQueryBuilder("chatbot_asked")
        .where("lession_id = :lession_id", { lession_id: lession?.id })
        .innerJoin("chatbot_asked.user", "user")
        .innerJoin("chatbot_asked.lession", "lession")
        .select(["chatbot_asked.chatbot_asked", "user.id", "lession.id"])
        .getMany(),
    ]);

    const result = [];

    for (const user of users) {
      const userPretestResults = pretests.map((pretest) => {
        const userPretestResult = pretest.pretestResults.find((pr) => {
          return pr.user.id === user.id;
        });
        return {
          created_at: userPretestResult?.created_at,
          pretestId: pretest.id,
          pretestQuestion: pretest.question,
          isAnswerCorrect: userPretestResult?.is_answer_correct || false,
        };
      });

      const correct = userPretestResults.filter(
        (result) => result.isAnswerCorrect
      ).length;
      const incorrect = userPretestResults.length - correct;
      const accuracy =
        correct === 0 ? 0 : (correct / (correct + incorrect)) * 100;

      const userChatbotAsked = chatbotAsked.find(
        (item) => item.user.id === user.id
      );
      const userGroup = await userGroupRepository
        .createQueryBuilder("user_group")
        .where("user_id = :user_id", { user_id: user.id })
        .andWhere("lession_id = :lession_id", { lession_id: lession?.id })
        .getOne();

      result.push({
        user,
        group: userGroup?.group ?? user.group ?? null,
        score: correct,
        answers: userPretestResults,
        accuracy,
        chatbot_asked: userChatbotAsked?.chatbot_asked ?? null,
        is_tested: true,
      });
    }

    // Users not tested
    const notTestedQuery = userRepository.createQueryBuilder();

    if (users.length > 0) {
      notTestedQuery.where("id NOT IN (:...ids)", {
        ids: users.map((u) => u?.id),
      });
    }

    const notTestedUsers = await notTestedQuery.getMany();

    for (const user of notTestedUsers) {
      const answers = pretests.map((pretest) => ({
        pretestId: pretest.id,
        pretestQuestion: pretest.question,
        isAnswerCorrect: false,
      }));

      const userChatbotAsked = chatbotAsked.find(
        (item) => item.user.id === user.id
      );
      const userGroup = await userGroupRepository
        .createQueryBuilder("user_group")
        .where("user_id = :user_id", { user_id: user.id })
        .andWhere("lession_id = :lession_id", { lession_id: lession?.id })
        .getOne();

      result.push({
        user,
        group: userGroup?.group ?? user.group ?? null,
        score: 0,
        answers,
        accuracy: 0,
        chatbot_asked: userChatbotAsked?.chatbot_asked ?? null,
        is_tested: false,
      });
    }

    // Sorting the result
    result.sort((a, b) => {
      if (a.group === null && b.group === null) {
        return 0;
      } else if (a.group === null) {
        return 1;
      } else if (b.group === null) {
        return -1;
      } else if (a.group === b.group) {
        return 0;
      }
      return a.group < b.group ? -1 : 1;
    });

    // Calculate group average
    const groupAverage = result.reduce((acc, cur) => {
      if (cur.group) {
        acc[cur.group] = acc[cur.group] || {
          score: 0,
          count: 0,
          accuracy: 0,
          testedCount: 0,
        };
        acc[cur.group].score += cur.score;
        acc[cur.group].count++;
        acc[cur.group].accuracy += cur.accuracy;
        if (cur.is_tested) {
          acc[cur.group].testedCount++;
        }
      }
      return acc;
    }, {});

    for (const userResult of result) {
      if (userResult.group) {
        const group = groupAverage[userResult.group];
        userResult.average_score = Math.round(group.score / group.count);
        userResult.average_accuracy = group.accuracy / group.count;
        userResult.group_tested = group.testedCount;
        userResult.group_count = group.count;
      }
    }

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err: any) {
    return responseErrors(res, 400, err);
  }
};

export const getPosttestLessionUserResultHandler = async (
  req: any,
  res: Response
) => {
  try {
    const lessionId = req.params.postId;
    const lession = await lessionRepository
      .createQueryBuilder("lession")
      .where("id = :id", { id: lessionId })
      .getOne();

    if (!lession) {
      return responseErrors(res, 400, "Lession not found");
    }

    if (!lession.have_posttest) {
      return res.status(200).json({ status: "success", data: [] });
    }

    // Promise all data
    const [users, posttests, chatbotAsked] = await Promise.all([
      userRepository
        .createQueryBuilder("user")
        .innerJoin(
          PosttestResult,
          "posttest_result",
          "posttest_result.user_id = user.id"
        )
        .innerJoin("posttest_result.posttest", "posttest")
        .innerJoin("posttest.lession", "lession")
        .where("lession.id = :lession_id", { lession_id: lession?.id })
        .groupBy("user.id")
        .getMany(),

      posttestRepository
        .createQueryBuilder("posttest")
        .leftJoinAndSelect("posttest.posttestResults", "posttest_result")
        .leftJoinAndSelect("posttest_result.user", "user")
        .where("posttest.lession_id = :lession_id", { lession_id: lession?.id })
        .orderBy("posttest.id", "ASC")
        .getMany(),

      chatbotAskedRepository
        .createQueryBuilder("chatbot_asked")
        .where("lession_id = :lession_id", { lession_id: lession?.id })
        .innerJoin("chatbot_asked.user", "user")
        .innerJoin("chatbot_asked.lession", "lession")
        .select(["chatbot_asked.chatbot_asked", "user.id", "lession.id"])
        .getMany(),
    ]);

    const result = [];

    for (const user of users) {
      const userPosttestResults = posttests.map((posttest) => {
        const userPosttestResult = posttest.posttestResults.find((pr) => {
          return pr.user.id === user.id;
        });
        return {
          created_at: userPosttestResult?.created_at,
          posttestId: posttest.id,
          posttestQuestion: posttest.question,
          isAnswerCorrect: userPosttestResult?.is_answer_correct || false,
        };
      });

      const correct = userPosttestResults.filter(
        (result) => result.isAnswerCorrect
      ).length;
      const incorrect = userPosttestResults.length - correct;
      const accuracy =
        correct === 0 ? 0 : (correct / (correct + incorrect)) * 100;

      const userChatbotAsked = chatbotAsked.find(
        (item) => item.user.id === user.id
      );
      const userGroup = await userGroupRepository
        .createQueryBuilder("user_group")
        .where("user_id = :user_id", { user_id: user.id })
        .andWhere("lession_id = :lession_id", { lession_id: lession?.id })
        .getOne();

      result.push({
        user,
        group: userGroup?.group ?? user.group ?? null,
        score: correct,
        answers: userPosttestResults,
        accuracy,
        chatbot_asked: userChatbotAsked?.chatbot_asked ?? null,
        is_tested: true,
      });
    }

    // Users not tested
    const notTestedQuery = userRepository.createQueryBuilder();

    if (users.length > 0) {
      notTestedQuery.where("id NOT IN (:...ids)", {
        ids: users.map((u) => u?.id),
      });
    }

    const notTestedUsers = await notTestedQuery.getMany();

    for (const user of notTestedUsers) {
      const answers = posttests.map((posttest) => ({
        posttestId: posttest.id,
        posttestQuestion: posttest.question,
        isAnswerCorrect: false,
      }));

      const userChatbotAsked = chatbotAsked.find(
        (item) => item.user.id === user.id
      );
      const userGroup = await userGroupRepository
        .createQueryBuilder("user_group")
        .where("user_id = :user_id", { user_id: user.id })
        .andWhere("lession_id = :lession_id", { lession_id: lession?.id })
        .getOne();

      result.push({
        user,
        group: userGroup?.group ?? user.group ?? null,
        score: 0,
        answers,
        accuracy: 0,
        chatbot_asked: userChatbotAsked?.chatbot_asked ?? null,
        is_tested: false,
      });
    }

    // Sorting the result
    result.sort((a, b) => {
      if (a.group === null && b.group === null) {
        return 0;
      } else if (a.group === null) {
        return 1;
      } else if (b.group === null) {
        return -1;
      } else if (a.group === b.group) {
        return 0;
      }
      return a.group < b.group ? -1 : 1;
    });

    // Calculate group average
    const groupAverage = result.reduce((acc, cur) => {
      if (cur.group) {
        acc[cur.group] = acc[cur.group] || {
          score: 0,
          count: 0,
          accuracy: 0,
          testedCount: 0,
        };
        acc[cur.group].score += cur.score;
        acc[cur.group].count++;
        acc[cur.group].accuracy += cur.accuracy;
        if (cur.is_tested) {
          acc[cur.group].testedCount++;
        }
      }
      return acc;
    }, {});

    for (const userResult of result) {
      if (userResult.group) {
        const group = groupAverage[userResult.group];
        userResult.average_score = Math.round(group.score / group.count);
        userResult.average_accuracy = group.accuracy / group.count;
        userResult.group_tested = group.testedCount;
        userResult.group_count = group.count;
      }
    }

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err: any) {
    return responseErrors(res, 400, err);
  }
};
