import React, { FC } from "react";

import { ICommonProps } from "@app/pages/UseContract/contracts/interfaces";
import { Address, EAbis } from "@app/hooks/useSmart";

import store from '@app/store';

import AppRow from "@app/components/Layout/AppRow";
import Symbol from "@app/components/common/app/Symbol";

import useSymbol from "@app/hooks/erc20/useSymbol";
import useGetAdminByType from "@app/hooks/communityContract/useGetAdminByType";
import { adminTypeView, EAdminType } from "@app/hooks/communityContract/useGetAdminByType";

import { InlineLoader } from "@app/components/common/app/InlineLoader";
import useBalanceOf from "@app/hooks/erc20/useBalanceOf";
import useBalances from "@app/hooks/communityContract/useBalances";

import Withdraw from "./Withdraw";
import Transfer from "./Transfer";

interface IAdminInfoAndWithdrawOptionsProps extends ICommonProps {
  adminType: EAdminType;
  currentAccountAddress: Address;
}

const AdminInfoAndWithdrawOptions: FC<IAdminInfoAndWithdrawOptionsProps> = ({
  chainInfo, adminType, currentAccountAddress,
  onUpdateRequired,
}) => {

  const targetTokenContractAddress
    = store.session((state) => (state.getTargetCommuntyTokenContract()));

  const { address, success: adminAddressSuccess, isPending, message } = useGetAdminByType(
    chainInfo,
    EAbis.communityAddress,
    adminType,
  );

  const {
    balance: rewardBalance, success: rewardSuccess, error,
    message: rewardMessage,
  } = useBalances(
    chainInfo,
    EAbis.communityAddress,
    address as Address,
    targetTokenContractAddress as Address
  );

  const {
    balance: tokenBalance, success: balanceSuccess
  } = useBalanceOf(
    chainInfo,
    EAbis.erc20,
    address as Address,
    targetTokenContractAddress as Address,
  );

  const { symbol } = useSymbol(chainInfo, EAbis.erc20, targetTokenContractAddress);

  const display = adminTypeView[adminType];

  if (`${currentAccountAddress}`.toLowerCase() !== `${address}`.toLowerCase())
    return (null);

  return (
    <AppRow withLine={true}>
      <div className="pd-20">{<Symbol symbol={display} />}</div>
      <div className="">
        {!balanceSuccess && !adminAddressSuccess && (message)}
        {isPending ? (<InlineLoader title="Updating..." />) : address}
      </div>
      <div className="pd-20">{'Token Contact Balance'}</div>
      <div className="">
        <Symbol symbol={symbol} value={tokenBalance || 0} />
      </div>
      <div className="pd-20">{'Community Contract Balance'}</div>
      <div className="">
        <Symbol symbol={symbol} value={rewardBalance || 0} />
      </div>

      <Withdraw
        chainInfo={chainInfo}
        abiName={EAbis.communityAddress}
        currentAccountAddress={currentAccountAddress}
        tokenBalance={tokenBalance}
        rewardBalance={rewardBalance}
        symbol={symbol}
        onUpdateRequired={onUpdateRequired}
      />

      <Transfer
        chainInfo={chainInfo}
        abiName={EAbis.communityAddress}
        currentAccountAddress={currentAccountAddress}
        tokenBalance={tokenBalance}
        rewardBalance={rewardBalance}
        symbol={symbol}
        onUpdateRequired={onUpdateRequired}
      />

    </AppRow>
  )

}


export default AdminInfoAndWithdrawOptions;