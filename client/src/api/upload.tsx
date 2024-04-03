import client from "./client";

export async function upload(data: any) {
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  return client({
    method: "POST",
    headers,
    url: "/upload/photo",
    data,
  });
}

export async function uploadFiles(data: any) {
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  return client({
    method: "POST",
    headers,
    url: "/upload/file",
    data,
  });
}

export async function uploadVideo(data: any) {
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  return client({
    method: "POST",
    headers,
    url: "/upload/video",
    data,
  });
}

export async function uploadMultiple(data: any) {
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  return client({
    method: "POST",
    headers,
    url: "/upload/multiple",
    data,
  });
}

export async function getPhotos(name: any) {
  return client({
    method: "get",
    url: `/upload/${name}`,
  });
}
