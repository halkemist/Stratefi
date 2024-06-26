'use client';

import { useAccount } from "wagmi";
import { useEffect } from "react";
import { redirect } from "next/navigation";

const layout = ({ children }) => {

  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected == false) {
      redirect('/')
    }
  }, [isConnected])

  return (
    <>
      <div>layout</div>
      <div>
        {children}
      </div>
    </>
    
  )
}

export default layout