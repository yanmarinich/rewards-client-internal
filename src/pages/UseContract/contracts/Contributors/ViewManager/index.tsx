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
import getValidatedContribution from "@app/hooks/contributors/useGetValidatedContribution";

const InfoRow: FC<{ field: string, value: any }> = ({ field, value }) => {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div> {field}: </div>
      <div> {value || 'n/a'}</div>
    </div>
  )
}

const ViewManager: FC<ICommonProps> = ({
  chainInfo,
  abiName,
  // symbol = '',
  // onUpdateRequired
}) => {

  const [selectedId, setSelectedId] = useState<number>(0);

  const selectIdInputRef = useRef<HTMLInputElement>(null);

  // const setLoader = store.system((state) => (state.setLoader));
  // const { writeContractAsync, writeContract } = useWriteContract();
  // const { address, isConnecting, isDisconnected } = useAccount();

  // const chains = getChains(wagmiConfig);
  // const mChain = chains.find((chain: Chain) => (chain.id === chainInfo.chainId));
  // const blockExplorerUrl = mChain?.blockExplorers?.default?.url || "";
  // const blockExplorerName = mChain?.blockExplorers?.default?.name || "";

  const {
    success, message, isPending: _isPending, data: result
  } = getValidatedContribution(chainInfo, abiName, selectedId);

  return (
    <>

      <div className="pd-10">
        <div>View available information: </div>
      </div>

      <AppRow withLine={true}>
        <div className="pd-10">
          {!success && (message || 'Failed to get information')}
          {success && (<Symbol symbol={'ID'} value={selectedId} toFixed={0} />)}
        </div>

      </AppRow>

      <AppRow withLine={true}>
        <InfoRow field={'Contribution-ID'} value={result?.contributionId} />
        <InfoRow field={'Validator-Address'} value={result?.validatorAddress} />
        <InfoRow field={'Address-Chain'} value={result?.addressChain} />
        <InfoRow field={'Token'} value={result?.token} />
        <InfoRow field={'Reward'} value={result?.reward} />
        <InfoRow field={'MetaData'} value={result?.metadataIdentifier} />
      </AppRow>

      <AppRow withLine={true}>

        <div className="input-main-wrapper">

          <div className="pd-10">
            Select ID:
          </div>

          <div className="pd-10">
            <input
              key={`set-id-input`}
              type="number"
              className="input-main"
              placeholder="Target ID of contributor"
              defaultValue={selectedId}
              ref={selectIdInputRef}
              min={0}
              step={1}
            />
          </div>

          <div className="pd-20">
            <ContinueButton
              text="Set ID"
              onContinue={() => {
                if (selectIdInputRef?.current?.value) {
                  const id = ((+selectIdInputRef?.current?.value) || 0);
                  setSelectedId(id);
                }
              }}
            />
          </div>

        </div>

      </AppRow>
    </>
  )

}

export default ViewManager;