import client from "./client";

export async function getLessions(params?: any) {
  return client({
    method: "GET",
    url: "/lessions",
    params,
  });
}

export async function getLession(id: any) {
  return client({
    method: "GET",
    url: `/lessions/${id}`,
  });
}

export async function createLession(data: any) {
  return client({
    method: "POST",
    url: "/lessions",
    data,
  });
}

export async function updateLession(data: any, id: any) {
  return client({
    method: "PUT",
    url: `/lessions/${id}`,
    data,
  });
}

export async function deleteLession(id: any) {
  return client({
    method: "DELETE",
    url: `/lessions/${id}`,
  });
}

export async function sendPretest(id: any, data: any) {
  return client({
    method: "POST",
    url: `/lessions/${id}/pretest-result`,
    data,
  });
}

export async function sendPosttest(id: any, data: any) {
  return client({
    method: "POST",
    url: `/lessions/${id}/posttest-result`,
    data,
  });
}

export async function getPretest(id: any) {
  return client({
    method: "GET",
    url: `/lessions/${id}/pretest-result`,
  });
}

export async function getPosttest(id: any) {
  return client({
    method: "GET",
    url: `/lessions/${id}/posttest-result`,
  });
}

export async function getPretestUser(id: any) {
  return client({
    method: "GET",
    url: `/lessions/${id}/pretest-user`,
  });
}

export async function getPosttestUser(id: any) {
  return client({
    method: "GET",
    url: `/lessions/${id}/posttest-user`,
  });
}

export async function updateGroupByLession(data: any, id: any) {
  return client({
    method: "PUT",
    url: `/users/${id}/group`,
    data,
  });
}
