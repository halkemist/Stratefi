'use client';

import { contractAbi, contractAddress } from "@/constants/governance";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from "wagmi";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Governance = () => {

  const [proposals, setProposals] = useState();

  useWatchContractEvent({
    address: contractAddress,
    abi: contractAbi,
    eventName: "",
    onLogs(logs) {
      console.log(logs)
      if (logs.length > 0) {
        setProposals(logs);
      }
    }
  })

  const propose = () => {
    console.log('propose')
  }

  return (
    <div>
      <Button onClick={() => propose()}>PROPOSE</Button>
      {!proposals || proposals.length === 0 ? (
        <div>Aucune proposition</div>
      ) : (
        <ul>
          {proposals.map((proposal, index) => (
            <li key={index}>
              <div>{proposal.name}</div>
            </li>
          ))}
          <li></li>
        </ul>
      )}
    </div>
  )
}

export default Governance;