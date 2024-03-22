import React, { FC } from "react";
import "./index.scss";

export interface ICustomLoaderProps {
  loader: string;
}

export const CustomLoader: FC<ICustomLoaderProps> = (props: ICustomLoaderProps) => {

  return (
    <div className="app-common-loader-wrapper">
      {props.loader}
      <br />
      <br />
      <img
        // alt={props.loader}
        // title={props.loader}
        src={"/loader.gif"}
      />
    </div>
  );
}


