import React, { FC } from "react";

export interface IFooterShowChainInfoProps {
  chainId: number;
  protocolName: string;
  contract?: string;
}

const FooterShowChainInfo: FC<IFooterShowChainInfoProps> = (info) => {
  return (
    <>
      <div style={{ color: "#777" }}>
        {info?.chainId && (<div>Chain-ID: {info?.chainId}</div>)}
        {info?.protocolName && (<div>Protocol: {info?.protocolName}</div>)}
        {info?.contract && (<div>Contract: {info?.contract}<br /></div>)}
      </div>
    </>
  )
}

export default FooterShowChainInfo;