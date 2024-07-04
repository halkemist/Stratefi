'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";

const CreateStrategy = () => {

  const [selectedProtocol, setSelectedProtocol] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState('');

  return (
    <div>
      <h2 className="font-bold text-2xl">Create Strategy</h2>
      <div className="mt-4">
        <div className="mb-2">1 - Choose protocol:</div>
        <div className="flex gap-2 p-4">
          <div onClick={() => {setSelectedProtocol(1)}} className={`w-40 cursor-pointer border rounded-xl ${selectedProtocol === 1 ? 'bg-black' : ''}`}>
            <img src="/assets/aave-logo.png"></img>
          </div>
        </div>
        {selectedProtocol ? (
          <>
            <div className="my-4">2 - Choose Strategy:</div>
            <div className="flex p-4">
              <div className="border-black border-r-4">
                <div className="mb-4 border-black border-b-4 p-2">FIRST ACTION</div>
                <Button onClick={() => {setSelectedStrategy('staking')}} variant="outline" className={selectedStrategy === 'staking' ? 'bg-black text-white' : 'bg-white text-black'}>STAKING</Button>
              </div>
              <div>
                <div className="mb-4 border-black border-b-4 p-2">SECOND ACTION</div>
                <Button onClick={() => {setSelectedStrategy('lending')}} variant="outline" className={selectedStrategy === 'lending' ? 'bg-black text-white' : 'bg-white text-black'}>LENDING</Button>
              </div>
            </div>
          </>
        ) : (<></>)}
        {selectedProtocol && selectedStrategy !== '' ? (
          <>
            <div className="my-4">3 - Create Strategy:</div>
            <div className="p-4">
              <Button>Create</Button>
            </div>
          </>
        ) : (<></>)}
      </div>
    </div>
  )
}

export default CreateStrategy;