import { redirect } from "react-router-dom";

export async function isAuthenticated(request: any): Promise<boolean> {
  // const session = await getSessionFromRequest(request);
  const accessToken = localStorage.getItem("accessToken");

  return accessToken !== "" && accessToken !== undefined;
}

export async function mustAuthenticated(request: any) {
  const auth = await isAuthenticated(request);

  if (!auth) {
    throw redirect("/signin");
  }
}
