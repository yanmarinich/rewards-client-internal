import React, { useEffect, FC } from "react";

import { IAppProps } from "../../../interfaces/app.interfaces"

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
