import React, { FC, useRef, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { getChains } from '@wagmi/core'
import { Chain } from "viem";

import { ICommonProps } from "../../interfaces";
import { Address, EAbis, useReadSmartProps } from "@app/hooks/useSmart";

import crypto from "@app/utils/crypto";
import * as Alert from "@app/utils/swal";
import tval from "@app/utils/tval";
import store from '@app/store';

import AppRow from "@app/components/Layout/AppRow";
import ContinueButton from "@app/components/Layout/ContinueButton";
import Symbol from "@app/components/common/app/Symbol";

import useSymbol from "@app/hooks/erc20/useSymbol";
import useHasAdminRole from "@app/hooks/accessControl/useHasAdminRole";

import wagmiConfig from "@app/providers/wagmi/config";
import { EAccessControlRole, EAccessControlRoleName, ISmartContractParams } from "@app/contracts";
import { getTxErrorMessage } from "@app/contracts/utils";
import { accessControlRols, IAcccessControlRoles } from "@app/contracts/";
import useRolesManager from "@app/hooks/proxy/getRoleMemberCount";
import { InlineLoader } from "@app/components/common/app/InlineLoader";
import AccessRoleSelector from "./AccessRoleSelector";

enum EType {
  grantRole = "grantRole",
  revokeRole = "revokeRole",
}

interface IAccessTypeItem {
  method: EType,
  display: string
}

const GrantRole: IAccessTypeItem = {
  method: EType.grantRole,
  display: 'Grant'
};

const RevokeRole: IAccessTypeItem = {
  method: EType.revokeRole,
  display: 'Revoke'
};

const RolesManager: FC<ICommonProps> = ({
  chainInfo,
  abiName,
  symbol = '',
  onUpdateRequired
}) => {

  const targetAddressToGrantInputRef = useRef<HTMLInputElement>(null);
  const targetAddressToRevokeInputRef = useRef<HTMLInputElement>(null);

  const [selectedRoleCounter, setSelectedRoleCounter] = useState<IAcccessControlRoles>(
    accessControlRols[0]
  );

  const [selectedRoleToGrant, setSelectedRoleToGrant] = useState<IAcccessControlRoles>(
    accessControlRols[0]
  );

  const [selectedRoleToRevoke, setSelectedRoleToRevoke] = useState<IAcccessControlRoles>(
    accessControlRols[0]
  );

  const setLoader = store.system((state) => (state.setLoader));
  const { writeContractAsync, writeContract } = useWriteContract();
  const { address, isConnecting, isDisconnected } = useAccount();

  const chains = getChains(wagmiConfig);
  const mChain = chains.find((chain: Chain) => (chain.id === chainInfo.chainId));
  const blockExplorerUrl = mChain?.blockExplorers?.default?.url || "";
  const blockExplorerName = mChain?.blockExplorers?.default?.name || "";

  const {
    success: countSuccess,
    message: countMessage,
    count,
    isPending: countIsPending,
    // status, 
    isError,
    isSuccess
  } = useRolesManager(
    chainInfo,
    abiName,
    selectedRoleCounter.uint256
  );
  const {
    success: roleSuccess, message: roleMessage, hasRole
  } = useHasAdminRole(
    chainInfo,
    EAbis.accessControl,
    address as Address
  );

  const symbolRes = useSymbol(chainInfo, EAbis.erc20);
  symbol = symbolRes.symbol;


  const onRoleCountSeleected = (index: number): void => {
    const item = accessControlRols[index];
    setSelectedRoleCounter(item);
  }

  const onRoleToGrantSeleected = (index: number): void => {
    const item = accessControlRols[index];
    setSelectedRoleToGrant(item);
  }

  const onGrantRole = async () => {
    const address = targetAddressToGrantInputRef.current?.value || "";
    return _onGrantOrReoveRole(GrantRole, address);
  }

  const onRevokeRole = async () => {
    const address = targetAddressToRevokeInputRef.current?.value || "";
    return _onGrantOrReoveRole(RevokeRole, address);
  }

  const _onGrantOrReoveRole = async (accessType: IAccessTypeItem, address: string) => {

    if (selectedRoleToGrant.uint256 === EAccessControlRole.none)
      return Alert.toast.error("Please select Role");

    if (!crypto.isAddress(address))
      return Alert.toast.error("Destination adddress is not valid");

    const table = Alert.createDialogTable(
      `Are you sure you want ${accessType.display} ${selectedRoleToGrant.name} role ? `,
      [
        { key: 'Role', value: `${selectedRoleToGrant.name}` },
        { key: 'Address', value: crypto.toShortAddress(address as Address) },
      ]
    );

    const q = await Alert.confirm({
      title: `Confirm ${accessType.display}`,
      html: table
    });

    if (!q)
      return Alert.toast.success('Aborting...');

    const propsRes = useReadSmartProps(chainInfo.protocolName, abiName, {
      functionName: accessType.method,
      args: [
        selectedRoleToGrant.uint256,
        address,
      ],
    });

    if (!propsRes.success) {
      setLoader("");
      Alert.alert.error(propsRes.message);
      return;
    }

    let isConfirmed = false;
    try {
      const timeout = setTimeout(() => {
        if (!isConfirmed) {
          setLoader("");
          Alert.alert.error("Failed: Transaction confirmation timeout . Please try again");
        }
      }, (60 * 1000));

      setLoader("Please approve transaction in your wallet");

      const params: any = propsRes.data as ISmartContractParams;
      writeContract(params);
      const mTxHash = await writeContractAsync(params);
      clearTimeout(timeout);
      isConfirmed = true;
      setLoader("");

      if (blockExplorerUrl) {
        const url = `${blockExplorerUrl}/tx/${mTxHash}`;
        await Alert.onTransactionSuccess(url, blockExplorerName);
      } else {
        await Alert.alert.success("Transaction has been completed successfully");
      }

      if (tval.isFunction(onUpdateRequired))
        onUpdateRequired();

    } catch (e: any) {
      isConfirmed = true;
      const message = getTxErrorMessage(e.message);
      Alert.alert.error(message);
      console.log(message);
      setLoader("");
    }

  }

  return (
    <>

      <div className="pd-10">
        <div>Current Account: </div>
        <div>{address}</div>
        {
          (roleMessage || !hasRole)
            ? <b className="red">{roleMessage || "You are not in the Admin group"}</b>
            : <b className="green">{"You are Administrator"}</b>
        }
      </div>

      <AppRow withLine={true}>

        <div className="pd-5">
          Select Role
        </div>

        <div className="">
          <AccessRoleSelector onSelected={(index: number) => {
            onRoleCountSeleected(index);
          }} />

          <div>
            {(!countSuccess && countMessage) ? countMessage : ''}
            {countIsPending && (<InlineLoader title="Updating..." />)}
            {
              selectedRoleCounter.uint256 !== EAccessControlRole.none
                ? (
                  countSuccess && `Total ${selectedRoleCounter.name}(s): ${count}`
                ) :
                (<i>&nbsp;</i>)
            }
            {/* {countSuccess && (<Symbol symbol={symbol} value={count} />)} */}
          </div>

        </div>

      </AppRow>

      <AppRow withLine={true}>

        <div className="input-main-wrapper">

          <div className="pd-5">
            Grant Access:
          </div>

          <AccessRoleSelector onSelected={(index: number) => {
            onRoleToGrantSeleected(index);
          }} />

          <div className="pd-5">
            <input
              key={`target-address-to-grant-input`}
              type="text"
              className="input-main"
              placeholder="Target Address"
              defaultValue={"0x417fff1315774037da11ed348e82A3a6912875B8"}
              ref={targetAddressToGrantInputRef}
            />
          </div>

          <div className="pd-20">
            <ContinueButton
              onContinue={onGrantRole}
              text="Grant Role"
              disabled={(!!roleMessage || !hasRole)}
            />
          </div>

        </div>

      </AppRow>

      <AppRow withLine={true}>

        <div className="input-main-wrapper">

          <div className="pd-5">
            Revoke Access:
          </div>

          <AccessRoleSelector onSelected={(index: number) => {
            onRoleToGrantSeleected(index);
          }} />

          <div className="pd-5">
            <input
              key={`target-address-to-revoke-input`}
              type="text"
              className="input-main"
              placeholder="Target Address"
              defaultValue={"0x417fff1315774037da11ed348e82A3a6912875B8"}
              ref={targetAddressToRevokeInputRef}
            />
          </div>

          <div className="pd-20">
            <ContinueButton
              onContinue={onRevokeRole}
              text="Revoke Role"
              disabled={(!!roleMessage || !hasRole)}
            />
          </div>

        </div>

      </AppRow>
    </>
  )

}

export default RolesManager;