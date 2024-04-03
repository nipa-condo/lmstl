import { redirect } from "react-router-dom";
import * as API from "../api";

export async function mustAuthenStudent() {
  try {
    const { data } = await API.getMe();
    const userData = data.data.user;

    return { userData };
  } catch (e: any) {
    throw redirect("/signin");
  }
}
