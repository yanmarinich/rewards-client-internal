import React, { useEffect, FC } from "react";

import { IAppProps } from "../../../interfaces/app.interfaces"

import "./index.scss";

export interface IAppTitle extends IAppProps {
  // withLine: boolean;
}

const AppTitle: FC<IAppTitle> = ({ children }: IAppTitle) => {

  // useEffect(() => {}, []);

  return (
    <h3 className="app-title">
      {children}
    </h3>
  );

};

export default AppTitle;