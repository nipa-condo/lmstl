import { Response } from "express";

export const responseErrors = (res: Response, status: number, err: any) => {
  return res.status(status).json({
    status: "error",
    message: err,
  });
};

export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex: number;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
