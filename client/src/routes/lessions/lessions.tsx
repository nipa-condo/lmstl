import React from "react";
import { redirect, useLoaderData, useNavigation } from "react-router-dom";
import { Spin } from "antd";

import { LessionGridBox } from "../../components/common";
import { HeaderContent, InfoContent } from "../../components/home";
import { AppLayout } from "../../components/layout/AppLayout";
import * as API from "../../api";
import { AuthContext } from "../../components/contexts/AuthContext";
import { mustAuthenStudent } from "../../config";

export async function loader() {
  const auth = await mustAuthenStudent();

  if (!auth) {
    redirect("/signin");
  }

  const lessions = await API.getLessions();

  return { lessions: lessions.data.data };
}

export const LessionsIndex = () => {
  const { lessions } = useLoaderData() as any;
  const { state } = useNavigation();
  const { setting } = React.useContext(AuthContext);
  return (
    <AppLayout>
      <div
        className="content-container"
        style={{
          marginBottom: "3rem",
          background: "#f3f4f6",
        }}
      >
        <div className="content-inner" style={{ flexDirection: "column" }}>
          <HeaderContent data="" showSeeMore={false} />
          <Spin spinning={state === "loading"}>
            {state != "loading" && <LessionGridBox data={lessions} />}
          </Spin>
        </div>
      </div>
    </AppLayout>
  );
};
