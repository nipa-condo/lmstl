import { Outlet, redirect } from "react-router-dom";
import { mustAuthenStudent } from "../config";

export async function loader({ params }: any) {
  const auth = await mustAuthenStudent();

  return auth ? true : redirect("/signin");
}

export const LessionRoot = () => {
  return <Outlet />;
};
