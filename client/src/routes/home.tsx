import React from "react";
import { useLoaderData, redirect } from "react-router-dom";

import { AppLayout } from "../components/layout";
import { LessionGridBox } from "../components/common";
import { BannerContent, HeaderContent, InfoContent } from "../components/home";
import * as API from "../api";
import { AuthContext } from "../components/contexts/AuthContext";
import { mustAuthenStudent } from "../config";

export async function loader() {
  const auth = await mustAuthenStudent();

  if (!auth) {
    redirect("/signin");
  }

  const lessions = await API.getLessions();

  return { lessions: lessions.data.data };
}

export const Home = () => {
  const { lessions } = useLoaderData() as any;
  const { setting } = React.useContext(AuthContext);

  return (
    <AppLayout>
      <div className="app-container" style={{ marginBottom: "3rem" }}>
        <BannerContent data={setting} />
        <div
          className="content-container"
          style={{
            paddingBottom: "3rem",
            background: "#f3f4f6",
          }}
        >
          <div className="content-inner" style={{ flexDirection: "column" }}>
            <HeaderContent data={setting} showSeeMore={true} />
            <LessionGridBox data={lessions} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
