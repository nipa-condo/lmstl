import { redirect } from "react-router-dom";
import * as API from "../api";

export async function mustAuthenticated() {
  try {
    const { data } = await API.getMe();
    const userData = data.data.user;
    if (userData.id == 1) {
      return true;
    } else {
      return false;
    }
  } catch (e: any) {
    throw redirect("/signin");
  }
}
