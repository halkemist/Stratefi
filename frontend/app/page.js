'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useAccount } from "wagmi";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import HeaderLanding from "@/components/shared/HeaderLanding";

export default function Home() {

  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected == true) {
      redirect('/dashboard')
    }
  }, [isConnected]);

  return (
    <>
      <HeaderLanding />
      <div className="flex justify-between">
        <div className="w-1/2 py-10 px-20">
          <h2 className="text-3xl font-bold mb-8">Unlock Your Financial Potential</h2>
          <p className="text-lg mb-4">Empowering your financial journey with personalized strategies and the strength of community support.</p>
          <div>
            <ConnectButton label="Connect your wallet" />
          </div>
        </div>
        <div className="w-1/2">
          <img src="/assets/right-image.jpg"></img>
        </div>
      </div>
    </>
  );
}
