'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const Header = () => {

  const { isConnected } = useAccount();

  return (
    <nav className="flex justify-between p-8">
      <h1 className="text-xl font-bold">STRATEFI</h1>
      {isConnected == true ? (
        <div>
          <ConnectButton/>
        </div>
      ) : (
        <></>
      )}
    </nav>
  )
}

export default Header;