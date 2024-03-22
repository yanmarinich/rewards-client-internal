import React, { FC } from "react";
import { IAppProps } from "@app/interfaces/app.interfaces"
import "./index.scss";

const AppRoot: FC<IAppProps> = ({ children }: IAppProps) => {
  return (
    <div id="app-root">
      {children}
    </div>
  );
};

export default AppRoot;
