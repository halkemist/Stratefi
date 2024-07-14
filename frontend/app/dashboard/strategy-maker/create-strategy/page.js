'use client';

// Core
import { useState } from "react";
import { useWriteContract } from "wagmi";

// UI components
import { Button } from "@/components/ui/button";
import { FaSpinner } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";

// Contracts
import { contractAbi, contractAddress } from "@/constants/strategyfactory";
import { providerAddress } from "@/constants/aave_pool_addresses_provider";

const CreateStrategy = () => {

  const [selectedProtocol, setSelectedProtocol] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [loader, setLoader] = useState(false);

  const { toast } = useToast();
  const { writeContractAsync } = useWriteContract();

  const createStrategy = async() => {
    try {

      setLoader(true);

      await writeContractAsync({
        abi: contractAbi,
        address: contractAddress,
        functionName: "createStrategy",
        args: [selectedStrategy, providerAddress]
      }, {
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Delegate error",
            description: error.cause.message
          })

          setLoader(false);
        },
        onSuccess: (data) => {
          toast({
            variant: "outline",
            title: "Strategy Created Successfully",
            description: ":)"
          })
          setLoader(false);
        }
      })
    } catch (err) {
      setLoader(false);
      console.log(err);
    }
  }

  return (
    <div>
      {loader ? (
        <>
          <div className="flex items-center gap-2">
            <FaSpinner className="spinner"/> 
            <span>Loading...</span>
          </div>
        </>
      ) : (
        <>
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
                    <Button onClick={() => {setSelectedStrategy('AAVE Supply Weth')}} variant="outline" className={selectedStrategy === 'AAVE Supply Weth' ? 'bg-black text-white' : 'bg-white text-black'}>Supply WETH</Button>
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
                  <Button onClick={createStrategy}>Create</Button>
                </div>
              </>
            ) : (<></>)}
          </div>
        </>
      )}
    </div>
  )
}

export default CreateStrategy;