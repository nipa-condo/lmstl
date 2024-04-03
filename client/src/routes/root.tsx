import React from "react";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { AuthContext } from "../components/contexts/AuthContext";
import "../config/118n";
import * as API from "../api";
import { ChatBot } from "../components/common/ChatBot";
import { Setting } from "./dashboard/setting";

export async function loader({ request }: any) {
  const setting = await API.getSetting();
  const accessToken = localStorage.getItem("token");
  if (accessToken) {
    try {
      const me = await API.getMe();
      return { setting: setting.data.data, me: me.data.data };
    } catch (e) {
      return { setting: setting.data.data };
    }
  } else {
    return { setting: setting.data.data };
  }
}

export const Root = () => {
  const accessToken = localStorage.getItem("token");
  const { setting, me } = useLoaderData() as any;
  const [chatBot, setChatbot] = React.useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSetChatbot = (values: any) => {
    setChatbot((prev) => [...prev, values]);
  };

  React.useEffect(() => {
    if (location.pathname == "/" && !accessToken) {
      navigate("/signin");
    }
    if (location.pathname == "/" && accessToken) {
      navigate("/home");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: me && me.user,
        setting: setting && setting.setting,
        chatBot: chatBot,
        onShowResChatbot: handleSetChatbot,
      }}
    >
      <Outlet />
    </AuthContext.Provider>
  );
};
