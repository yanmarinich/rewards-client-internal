import React, { FC } from "react";
import { useAccount } from "wagmi";

import { ICommonProps } from "@app/pages/UseContract/contracts/interfaces";
import { Address } from "@app/hooks/useSmart";

import AppRow from "@app/components/Layout/AppRow";
import { EAdminType } from "@app/hooks/communityContract/useGetAdminByType";
import AdminInfoAndWithdrawOptions from "./AdminInfoAndWithdrawOptions";

const ShowAdmins: FC<ICommonProps> = ({
  chainInfo,
  abiName,
  onUpdateRequired
}) => {

  const { address: currentAccountAddress } = useAccount();

  return (
    <>
      <AppRow withLine={true}>
        <div className="pd-10">
          <div>Contract Administrators: </div>
        </div>
      </AppRow>

      <AppRow withLine={false}>
        <AdminInfoAndWithdrawOptions
          abiName={abiName}
          chainInfo={chainInfo}
          adminType={EAdminType.foundationAdmin}
          currentAccountAddress={currentAccountAddress as Address}
          onUpdateRequired={onUpdateRequired}
        />
        <AdminInfoAndWithdrawOptions
          abiName={abiName}
          chainInfo={chainInfo}
          adminType={EAdminType.rewardsAdmin}
          currentAccountAddress={currentAccountAddress as Address}
          onUpdateRequired={onUpdateRequired}
        />
        <AdminInfoAndWithdrawOptions
          abiName={abiName}
          chainInfo={chainInfo}
          adminType={EAdminType.treasuryAdmin}
          currentAccountAddress={currentAccountAddress as Address}
          onUpdateRequired={onUpdateRequired}
        />
        <AdminInfoAndWithdrawOptions
          abiName={abiName}
          chainInfo={chainInfo}
          adminType={EAdminType.validationsAdmin}
          currentAccountAddress={currentAccountAddress as Address}
          onUpdateRequired={onUpdateRequired}
        />

      </AppRow>

    </>
  )

}

export default ShowAdmins;
