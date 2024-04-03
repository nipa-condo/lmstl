import { NextFunction, Request, Response } from "express";
import { User } from "../entities/user.entity";
import { responseErrors } from "../utils/common";
import { AppDataSource } from "../ormconfig";
import { UserGroup } from "../entities/user-group.entity";

const userRepository = AppDataSource.getRepository(User);

/* Getting the usergroup repository from the database. */
const userGroupRepository = AppDataSource.getRepository(UserGroup);

export const updateUserGroupHandler = async (
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

    const userGroup = await userGroupRepository
      .createQueryBuilder("user_group")
      .where("user_id = :userId", { userId: users.id })
      .andWhere("lession_id = :lessionId", { lessionId: input.lession_id })
      .getOne();

    if (userGroup) {
      if (!input.group || input.group === "") {
        await userGroup.remove();
      } else {
        userGroup.group = input.group;
        userGroup.user = users;
        userGroup.lession = input.lession_id;
        await userGroupRepository.save(userGroup);
      }
    } else {
      if (!input.group) {
        if (input.group === "") {
          return responseErrors(res, 400, "Group not found");
        }
      }
      const newGroup = new UserGroup();
      newGroup.group = input.group;
      newGroup.user = users;
      newGroup.lession = input.lession_id;
      await userGroupRepository.save(newGroup);
    }

    res.status(200).json({
      status: "success",
    });
  } catch (err: any) {
    return responseErrors(res, 400, "Can't update your user");
  }
};

export const deleteUserGroupHandler = async (
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

    const userGroup = await userGroupRepository
      .createQueryBuilder("user_group")
      .where("user_id = :userId", { userId: users.id })
      .andWhere("lession_id = :lessionId", { lessionId: input.lession_id })
      .getOne();

    if (!userGroup) {
      return responseErrors(res, 400, "User group not found");
    }

    await userGroup.remove();

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err: any) {
    return responseErrors(res, 400, "Can't delete your user group");
  }
};
