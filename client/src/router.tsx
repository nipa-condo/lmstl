import { createBrowserRouter } from "react-router-dom";
import { SingIn } from "./routes/signin";
import { SingInDashboard } from "./routes/signin-dashboard";
import { Root } from "./routes";
import { Home } from "./routes/home";
import { Dashboard } from "./routes/dashboard";
import { LessionsIndex } from "./routes/lessions";
import { LessionsSinglePage } from "./routes/lessions/lessions-single";
import { LessionsSinglePretest, Result } from "./routes/lessions/$id";
import { LessionsSinglePosttest } from "./routes/lessions/$id/posttest";
import { LessionsSingle } from "./routes/lessions/$id/single";
import ErrorPage from "./error-page";
import { UsersAdminIndex, UserAdminNew } from "./routes/dashboard/users";
import { UserAdminSingle } from "./routes/dashboard/users/$id";
import {
  LessionsAdminIndex,
  LessionAdminNew,
  LessionAdminSingleView,
} from "./routes/dashboard/lessions";
import { LessionAdminSingle } from "./routes/dashboard/lessions/$id";

import { Register } from "./routes/resgister";

import { loader as rootLoader } from "./routes/root";
import { loader as profileLoader, Profile } from "./routes/profile";
import { loader as lessionLoader } from "./routes/lessions/lessions";
import { loader as lessionSingleRooeLoader } from "./routes/lessions/lessions-single";
import { loader as homeLoader } from "./routes/home";
import {
  LessionRoot,
  loader as lessionRootLoader,
} from "./routes/lessions-root";
import { loaderSingle as lessionAdminViewLoader } from "./routes/dashboard/lessions/lessions-view";
import { loader as lessionAdminLoader } from "./routes/dashboard/lessions/lessions";
import { loader as lessionAdminEditLoader } from "./routes/dashboard/lessions/$id";
import { loader as userAdminLoader } from "./routes/dashboard/users/users";
import { loader as userAdminEditLoader } from "./routes/dashboard/users/$id";
import {
  loader as settingAdminLoader,
  Setting,
} from "./routes/dashboard/setting";
import { loader as lessionResultLoader } from "./routes/lessions/$id/result";
import { action as lessionAdminCreate } from "./routes/dashboard/lessions/lessions-new";
import { action as lessionAdminUpdate } from "./routes/dashboard/lessions/$id";
import { action as profileAction } from "./routes/profile";
import { action as userAdminCreate } from "./routes/dashboard/users/user-new";
import { action as userAdminUpdate } from "./routes/dashboard/users/$id";
import { action as settingAdminEdit } from "./routes/dashboard/setting";

import { loader as dashboardLoader } from "./routes/dashboard/dashboard";
import { action as signInDashboardAction } from "./routes/signin-dashboard";

import { action as registerAction } from "./routes/resgister";
import { action as signinAction } from "./routes/signin";

import { action as pretestAction } from "./routes/lessions/$id/pretest";
import { action as postestAction } from "./routes/lessions/$id/posttest";

import {
  Analytics,
  loader as analyticAdminLoader,
} from "./routes/dashboard/analytics";

import { DashboardIndex } from "./routes/dashboard/dashboard-index";
import { updateGroupByLession } from "./components/dashboard/analytic/HandleGroup";

export const router = createBrowserRouter([
  {
    path: "/",
    loader: rootLoader,
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "signin",
        action: signinAction,
        element: <SingIn />,
      },
      {
        path: "register",
        action: registerAction,
        element: <Register />,
      },
      {
        path: "signin-dashboard",
        action: signInDashboardAction,
        element: <SingInDashboard />,
      },

      {
        path: "home",
        loader: homeLoader,
        element: <Home />,
      },
      {
        path: "profile",
        loader: profileLoader,
        action: profileAction,
        element: <Profile />,
      },
      {
        path: "lessions",
        loader: lessionRootLoader,
        element: <LessionRoot />,
        children: [
          {
            index: true,
            loader: lessionLoader,
            element: <LessionsIndex />,
          },
          {
            path: ":id/result",
            loader: lessionResultLoader,
            element: <Result />,
          },
          {
            path: ":id",
            id: "lession-single-root",
            loader: lessionSingleRooeLoader,
            element: <LessionsSinglePage />,
            children: [
              {
                index: true,
                element: <LessionsSingle />,
              },
              {
                path: "pretest",
                action: pretestAction,
                element: <LessionsSinglePretest />,
              },

              {
                path: "posttest",
                action: postestAction,
                element: <LessionsSinglePosttest />,
              },
            ],
          },
        ],
      },

      {
        path: "dashboard",
        loader: dashboardLoader,
        element: <Dashboard />,
        children: [
          {
            index: true,
            element: <DashboardIndex />,
          },
          {
            path: "analytics",
            loader: analyticAdminLoader,
            element: <Analytics />,
          },
          {
            path: "analytics/:id",
            loader: lessionAdminViewLoader,
            action: updateGroupByLession,
            element: <LessionAdminSingleView />,
          },
          {
            path: "lessions",
            loader: lessionAdminLoader,
            element: <LessionsAdminIndex />,
          },

          {
            path: "lessions/:id/edit",
            loader: lessionAdminEditLoader,
            action: lessionAdminUpdate,
            element: <LessionAdminSingle />,
          },
          {
            path: "lessions/new",
            action: lessionAdminCreate,
            element: <LessionAdminNew />,
          },

          {
            path: "users",
            loader: userAdminLoader,
            element: <UsersAdminIndex />,
          },
          {
            path: "users/:id",
            loader: userAdminEditLoader,
            action: userAdminUpdate,
            element: <UserAdminSingle />,
          },
          {
            path: "users/new",
            action: userAdminCreate,
            element: <UserAdminNew />,
          },
          {
            path: "setting",
            loader: settingAdminLoader,
            action: settingAdminEdit,
            element: <Setting />,
          },
        ],
      },
    ],
  },
]);
