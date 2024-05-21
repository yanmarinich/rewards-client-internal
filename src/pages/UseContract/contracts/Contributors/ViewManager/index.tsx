import React, { FC, useState } from "react";
import { ICommonProps } from "../../interfaces";
import store from '@app/store';
import AppRow from "@app/components/Layout/AppRow";
import ContinueButton from "@app/components/Layout/ContinueButton";
import Symbol from "@app/components/common/app/Symbol";

import getValidatedContribution, { IValidatorReward } from "@app/hooks/contributors/useGetValidatedContribution";
import { IContributorsState } from "@app/store/types/interfaces/session";

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

  const contributorsState: IContributorsState = store.session((state) => (state.getContributorsState()));
  const setContributorState = store.session((state) => (state.setContributorsState));
  const [selectedId, setSelectedId] = useState<number>(0);

  const {
    success, message, isPending: _isPending, data: result
  } = getValidatedContribution(chainInfo, abiName, contributorsState.lastContributorId);

  const setLastContributorId = (id: number) => {
    setContributorState({
      ...contributorsState,
      lastContributorId: id,
    });
  }

  return (
    <>

      <div className="pd-10">
        <div>View available information: </div>
      </div>

      <AppRow withLine={true}>
        <div className="pd-10">
          {!success && (message || 'Failed to get information')}
          {success && (<Symbol symbol={'ID'} value={contributorsState.lastContributorId} toFixed={0} />)}
        </div>
      </AppRow>

      <AppRow withLine={true}>
        <div className="pd-10">
          <InfoRow field={'Validator-Address'} value={result?.validatorAddress} />
          <InfoRow field={'Address-Chain'} value={result?.addressChain} />
          <InfoRow field={'Token'} value={result?.token} />
          {/* <InfoRow field={'Reward'} value={result?.reward} /> */}
          <Symbol symbol={'Reward'} value={result?.reward} toFixed={6} />
        </div>

        <div className="pd-20">
          <div>Metadata: </div>
        </div>
        <div className="pd-10" style={{ background: '#999', color: '#333' }}>
          {result?.metadataIdentifier}
        </div>

      </AppRow>

      <AppRow withLine={true}>
        <div className="pd-10">
          <div>Validator-Rewards: </div>
        </div>
        {result && result.validatorRewards
          .map((reward: IValidatorReward, index: number) => {
            return (
              <div
                key={`reward.validator-${reward.validator}`}
                className="pd-20"
              >
                {reward.validator} -<Symbol symbol={'Reward'} value={reward.reward} toFixed={6} />
              </div>
            );
          })
        }
      </AppRow>

      <AppRow withLine={true}>

        <div className="input-main-wrapper">
          <div className="pd-10"> Select ID: </div>
          <div className="pd-10">
            <input
              key={`set-id-input`}
              type="number"
              className="input-main"
              placeholder="Target ID of contributor"
              defaultValue={contributorsState.lastContributorId}
              min={0}
              step={1}
              onChange={({ target }) => {
                const id = (+target.value);
                setSelectedId(id);
              }}
            />
          </div>
          <div className="pd-20">
            <ContinueButton
              text="Set ID"
              onContinue={() => {
                setLastContributorId(selectedId);
              }}
            />
          </div>
        </div>
      </AppRow>
    </>
  )

}

export default ViewManager;