import React, { useEffect, FC } from "react";

import { IAppProps } from "../../../interfaces/app.interfaces"

import "./index.scss";

export interface IAppRow extends IAppProps {
  withLine: boolean;
}

const AppRow: FC<IAppRow> = ({ children, withLine = true }: IAppRow) => {

  // useEffect(() => {}, []);

  return (
    <div className="app-row content-center DEL-pd-10">
      {withLine && (<div className="h-line" />)}
      <div>
        {children}
      </div>
    </div>
  );

};

export default AppRow;
