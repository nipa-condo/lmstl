import { Outlet, redirect } from "react-router-dom";
import { DashboardLayout } from "../../components/layout";
import { mustAuthenticated } from "../../config";

export async function loader() {
  const auth = await mustAuthenticated();
  return auth ? true : redirect("/signin-dashboard");
}

export const Dashboard = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};
