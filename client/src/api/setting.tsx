import client from "./client";

export async function getSetting() {
  return client({
    method: "GET",
    url: "/settings",
  });
}

export async function updateSetting(data: any) {
  return client({
    method: "PUT",
    url: `/settings`,
    data,
  });
}

export async function sendMessageChatBot(data: any) {
  return client({
    method: "POST",
    url: "/settings/chatbot",
    data,
  });
}
