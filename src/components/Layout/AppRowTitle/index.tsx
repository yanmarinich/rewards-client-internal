import React, { FC } from "react";
import { IAppProps } from "@app/interfaces/app.interfaces"
import "./index.scss";

export interface IAppTitle extends IAppProps {
  // withLine: boolean;
}

const AppTitle: FC<IAppTitle> = ({ children }: IAppTitle) => {
  return (
    <h3 className="app-title">
      {children}
    </h3>
  );
};

export default AppTitle;
