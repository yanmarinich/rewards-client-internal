import { IAppProps } from "@app/interfaces/app.interfaces";
import React, { FC } from "react";
import { Bars } from 'react-loading-icons'

import "./index.scss";

{/* 
<Audio />
<BallTriangle />
<Bars />
<Circles />
<Grid />
<Hearts />
<Oval />
<Puff />
<Rings />
<SpinningCircles />
<TailSpin />
<ThreeDots />
*/}

export interface InlineLoaderProps extends IAppProps {
  title?: string;
}

export const InlineLoader: FC<InlineLoaderProps> = ({ title }: InlineLoaderProps) => {
  return (
    <div className="loader-wrapper">
      <Bars className="loader" /> {title && title}
    </div>
  );
}


