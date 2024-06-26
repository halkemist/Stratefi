'use client';

import { useAccount } from "wagmi";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import Navigation from "@/components/shared/Navigation";

const layout = ({ children }) => {

  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected == false) {
      redirect('/')
    }
  }, [isConnected])

  return (
    <div className="flex grow">
      <div className="w-64 border-r border-t">
        <Navigation/>
      </div>
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  )
}

export default layout