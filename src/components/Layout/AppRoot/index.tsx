import React, { useEffect, FC } from "react";

import { IAppProps } from "@app/interfaces/app.interfaces"

import "./index.scss";

const AppRoot: FC<IAppProps> = ({ children }: IAppProps) => {

  // useEffect(() => {}, []);

  return (
    <div id="app-root">
      {children}
    </div>
  );

};

export default AppRoot;
