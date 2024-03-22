import React, { FC } from "react";

// import store from "../store";
// import { IAppProps } from "../App/interfaces";

import {
  createBrowserRouter, Navigate,
  // Outlet, NavLink, redirect,
} from "react-router-dom";

import LayoutMain from "@app/layouts/Main";

import Landing from "@app/pages/Landing";
import SelectContract from "@app/pages/SelectContract";
import SelectProtocol from "@app/pages/SelectProtocol";
import UseContract from "@app/pages/UseContract";

import ErrorPage from "@app/pages/ErrorPage";
import NotFoundPage from "@app/pages/NotFoundPage";

const routes = [
  {
    path: "/", element: (<LayoutMain />),
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: (<Landing />) },
      { path: "/select-contract", element: (<SelectContract />) },
      { path: "/select-protocol", element: (<SelectProtocol />) },
      { path: "/use-contract*", element: (<UseContract />) },
      { path: "/*", element: (<NotFoundPage />) },
    ],
  },
  // {
  //   path: "/user", exact: true, element: (<Navigate to="/user/login" replace={true} />),
  // },
];

export default createBrowserRouter(routes);
