'use client';

// Constants
import { contractAbi, contractAddress } from "@/constants/governance";

// Wagmi
import { useReadContract, useWatchContractEvent, useWriteContract } from "wagmi";

// React
import { useState } from "react";

// UI
import { Button } from "@/components/ui/button";

const Governance = () => {

  const [ proposals, setProposals ] = useState();

  useWatchContractEvent({
    address: contractAddress,
    abi: contractAbi,
    eventName: "ProposalCreated",
    onLogs(logs) {
      console.log(logs)
      if (logs.length > 0) {
        setProposals(logs);
      }
    }
  })

  const { writeContractAsync } = useWriteContract();

  const handleAddProposal = async() => {
    try {
      const { data: result, onSuccess: isSuccess } = await writeContractAsync({
        abi: contractAbi,
        address: contractAddress,
        functionName: "propose",
        args: [
          ["0x0000000000000000000000000000000000000000"],
          [0],
          ["0x"],
          "hello, it's the second proposal of the stratefi dapp !"
        ]
      })
    } catch (err) {
      console.log(err)
    }
    
  }

  return (
    <div>
      <Button onClick={handleAddProposal}>PROPOSE</Button>
      {!proposals || proposals.length === 0 ? (
        <div>Aucune proposition</div>
      ) : (
        <ul>
          {proposals.map((proposal, index) => (
            <li key={index}>
              <div>{Number(proposal.args.proposalId)}</div>
              <div>By: {proposal.args.proposer}</div>
              <div>{proposal.args.description}</div>
              <div>{Number(proposal.args.voteEnd)}</div>
            </li>
          ))}
          <li></li>
        </ul>
      )}
    </div>
  )
}

export default Governance;