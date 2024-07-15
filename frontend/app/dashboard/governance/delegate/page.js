'use client';

// UI components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Hooks
import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";

// Constants
import { contractAbi, contractAddress } from "@/constants/token";

// Wagmi
import { useWatchContractEvent } from "wagmi";

const Delegate = () => {

  // State
  const [delegateAddress, setDelegateAddress] = useState();
  const { address: userAddress } = useAccount();

  const { writeContractAsync } = useWriteContract();
  const { toast } = useToast();

  // Watch
  
  useWatchContractEvent({
    address: contractAddress,
    abi: contractAbi,
    fromBlock: BigInt(12648000),
    eventName: "DelegateChanged",
    onLogs(logs) {
      console.log(logs)
    }
  })

  // Handle
  const handleDelegate = async(address) => {
    try {
      await writeContractAsync({
        abi: contractAbi,
        address: contractAddress,
        functionName: "delegate",
        args: [delegateAddress || address]
      }, {onError: (error) => {
        toast({
          variant: "destructive",
          title: "Delegate error",
          description: error.cause.message
        })
      }})

      setDelegateAddress("");
    } catch (err) {
      console.log(err);
    }
  }

  const handleSelfDelegate = () => {
    handleDelegate(userAddress);
  }

  return (
    <div className="w-2/3 flex flex-col gap-4">
      <div className="flex">
        <Input 
            value={delegateAddress}
            onChange={(e) => setDelegateAddress(e.target.value)}
            className="w-30 mr-2" 
            placeholder="Delegate Address" 
            type="text"
        />
        <Button onClick={handleDelegate}>Delegate</Button>
      </div>
      <div>
        OR
      </div>
      <div>
        <Button onClick={handleSelfDelegate}>Self-Delegate</Button>
      </div>
    </div>
  )
}

export default Delegate;