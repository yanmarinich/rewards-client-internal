import { useNavigate } from "react-router-dom";
import { useAccount, useSwitchChain, useDisconnect } from "wagmi";

export const useGoAndConnect = () => {

  // const chainIsSupported = useChainIsSupported(chainId);
  const { address, isConnecting, isDisconnected } = useAccount();

  const navigate = useNavigate();

  if ((!isConnecting || isDisconnected) && !address) {
    console.log(`redirect: /`);
    navigate('/');
  }

}