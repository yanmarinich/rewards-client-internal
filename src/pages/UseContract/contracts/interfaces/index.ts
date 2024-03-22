import { EAbis, IChainInfo, IContractItem } from "@app/hooks/useSmart";

export interface ICommonProps {
  chainInfo: IChainInfo;
  abiName: EAbis;
  symbol?: string;
  contracts?: IContractItem[];
  onUpdateRequired?(): void;
}

