import client from "./client";

export async function getAnalytics(params?: any) {
  return client({
    method: "GET",
    url: "/analytics",
    params,
  });
}
