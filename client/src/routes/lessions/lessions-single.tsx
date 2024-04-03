import React from "react";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import { InfoContent } from "../../components/home";
import { AppLayout } from "../../components/layout/AppLayout";
import * as API from "../../api";
import { Image } from "antd";
import { AuthContext } from "../../components/contexts/AuthContext";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

export async function loader({ params }: any) {
  const lession = await API.getLession(params.id);

  return { lession: lession.data.data };
}

export const LessionsSinglePage = () => {
  const { lession } = useLoaderData() as any;

  const navigate = useNavigate();
  const { setting } = React.useContext(AuthContext);

  const { id } = useParams();

  React.useEffect(() => {
    if (
      lession.lession.have_pretest &&
      !lession.lession.have_content &&
      !lession.lession.have_posttest &&
      !lession.result_test.is_test_pretest
    ) {
      navigate(`/lessions/${id}/pretest`);
    }

    if (
      lession.lession.have_posttest &&
      !lession.lession.have_pretest &&
      !lession.lession.have_content
    ) {
      navigate(`/lessions/${id}/posttest`);
    }

    if (
      lession.lession.have_pretest &&
      lession.lession.have_posttest &&
      !lession.result_test.is_test_pretest
    ) {
      navigate(`/lessions/${id}/pretest`);
    }

    if (
      lession.lession.have_pretest &&
      lession.lession.have_content &&
      !lession.result_test.is_test_pretest
    ) {
      navigate(`/lessions/${id}/pretest`);
    }
  }, []);

  return (
    <AppLayout>
      <div
        className="content-container"
        style={{
          background: "#f3f4f6",
        }}
      >
        <div className="content-inner" style={{ flexDirection: "column" }}>
          {lession.lession?.photo_url && (
            <Image
              src={lession.lession?.photo_url}
              preview={false}
              style={{
                backgroundSize: "cover",
                marginBottom: "24px",
                marginTop: "24px",
              }}
            ></Image>
          )}
          <Outlet />
        </div>
      </div>
    </AppLayout>
  );
};
