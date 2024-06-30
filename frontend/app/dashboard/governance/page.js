'use client';

// Constants
import { contractAbi, contractAddress } from "@/constants/governance";

// Wagmi
import { useWatchContractEvent, useWriteContract, useWatchBlockNumber } from "wagmi";

// React
import { useState } from "react";

// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge"

const Governance = () => {

  const [ currentBlockNumber, setCurrentBlockNumber ] = useState(0);

  useWatchBlockNumber({
    onBlockNumber(blockNumber) {
      setCurrentBlockNumber(Number(blockNumber))
    },
  });

  const [ proposals, setProposals ] = useState();

  useWatchContractEvent({
    address: contractAddress,
    abi: contractAbi,
    fromBlock: BigInt(0),
    eventName: "ProposalCreated",
    onLogs(logs) {
      console.log(logs)
      if (logs.length > 0) {
        setProposals(logs);
      }
    }
  });

  const timeRemaining = (voteEnd) => {
    if (voteEnd && currentBlockNumber) {
      const blocksRemaining = voteEnd - currentBlockNumber;
      const secondsPerBlock = 13;
      const timeRemainingInSeconds = blocksRemaining * secondsPerBlock;
      const timeRemainingInMinutes = timeRemainingInSeconds / 60;
      const timeRemainingInHours = timeRemainingInMinutes / 60;
      return timeRemainingInHours / 24;
    }
    return 0;
  };

  const [ proposalInput, setProposalInput ] = useState("");

  const handleInputChange = (event) => {
    setProposalInput(event.target.value);
  };

  const { writeContractAsync } = useWriteContract();

  const handleAddProposal = async() => {
    try {
      await writeContractAsync({
        abi: contractAbi,
        address: contractAddress,
        functionName: "propose",
        args: [
          ["0x0000000000000000000000000000000000000000"],
          [0],
          ["0x"],
          proposalInput
        ]
      })

      setProposalInput("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold">Proposals</h2>
      <div className="flex my-4">
        <Input onChange={handleInputChange} type="text" placeholder="Description" className="w-1/2 mr-4 rounded-xl"/>
        <Button onClick={handleAddProposal}>Add New Proposal</Button>
      </div>
      {!proposals || proposals.length === 0 ? (
        <div>No proposals</div>
      ) : (
        <div className="flex flex-col">
          {proposals.map((proposal, index) => (
            <div key={index} className="border rounded-xl p-4 my-4">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Avatar className="mr-1">
                    <AvatarFallback>T</AvatarFallback>
                  </Avatar>
                  <div>{proposal.args.proposer}</div>
                </div>
                <Badge variant="secondary">{timeRemaining(Number(proposal.args.voteEnd))} days</Badge>
              </div>
              <p className="p-4">{proposal.args.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Governance;