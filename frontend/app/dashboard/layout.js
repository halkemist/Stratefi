'use client';

import { useAccount } from "wagmi";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import Navigation from "@/components/shared/Navigation";
import Footer from "@/components/shared/Footer";

const layout = ({ children }) => {

  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected == false) {
      redirect('/')
    }
  }, [isConnected])

  return (
    <div className="flex grow">
      <div className="w-64 border-r">
        <Navigation/>
      </div>
      <div className="flex flex-col min-h-screen w-full">
        <div className="flex-grow px-12 pt-16">
          {children}
        </div>
        <Footer/>
      </div>
    </div>
  )
}

export default layout