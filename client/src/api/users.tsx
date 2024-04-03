import client from "./client";

export async function register(data: any) {
  return client({
    method: "POST",
    url: "/auth/register",
    data,
  });
}

export async function updateStudent(data: any, id: any) {
  return client({
    method: "PUT",
    url: `/users/${id}`,
    data,
  });
}

export async function deleteStudent(id: any) {
  return client({
    method: "DELETE",
    url: `/users/${id}`,
  });
}

export async function getStudents() {
  return client({
    method: "GET",
    url: "/users",
  });
}

export async function getStudent(id: any) {
  return client({
    method: "GET",
    url: `/users/${id}`,
  });
}

export async function verify(id: any) {
  return client({
    method: "put",
    url: `/users/${id}/approve`,
  });
}
