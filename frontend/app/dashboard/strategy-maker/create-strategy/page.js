'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";

const CreateStrategy = () => {

  const [selectedProtocol, setSelectedProtocol] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState('');

  const createStrategy = () => {
    
  }

  return (
    <div>
      <h2 className="font-bold text-2xl">Create Strategy</h2>
      <div className="mt-4">
        <div className="mb-2">1 - Choose protocol:</div>
        <div className="flex gap-3 p-4">
          <div onClick={() => {setSelectedProtocol(1)}} className={`w-40 cursor-pointer border rounded-xl ${selectedProtocol === 1 ? 'bg-black' : ''}`}>
            <img src="/assets/aave-logo.png"></img>
          </div>
          <div className="w-40 border rounded-xl grayscale flex items-center p-2">
            <img src="/assets/Uniswap_Logo_and_Wordmark.svg"></img>
          </div>
        </div>
        {selectedProtocol ? (
          <>
            <div className="my-4">2 - Choose Strategy:</div>
            <div className="flex p-4 gap-3">
              <div className="border-black">
                <Button onClick={() => {setSelectedStrategy('supply-weth')}} variant="outline" className={selectedStrategy === 'supply-weth' ? 'bg-black text-white' : 'bg-white text-black'}>Supply WETH</Button>
              </div>
              <div>
                <Button variant="outline" className="grayscale" disabled>Supply ETH</Button>
              </div>
              <div>
                <Button variant="outline" className="grayscale" disabled>Supply USDC</Button>
              </div>
            </div>
          </>
        ) : (<></>)}
        {selectedProtocol && selectedStrategy !== '' ? (
          <>
            <div className="my-4">3 - Create Strategy:</div>
            <div className="p-4">
              <Button onClick={() => createStrategy()}>Create</Button>
            </div>
          </>
        ) : (<></>)}
      </div>
    </div>
  )
}

export default CreateStrategy;