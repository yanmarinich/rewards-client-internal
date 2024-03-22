import React, { FC } from "react";
import { IAppProps } from "@app/interfaces/app.interfaces"
import "./index.scss";
export interface IAppRow extends IAppProps {
  withLine: boolean;
}

const AppRow: FC<IAppRow> = ({ children, withLine = true }: IAppRow) => {
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
