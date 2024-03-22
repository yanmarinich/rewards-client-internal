import React from "react";
import { createBrowserRouter } from "react-router-dom";

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
];

export default createBrowserRouter(routes);
