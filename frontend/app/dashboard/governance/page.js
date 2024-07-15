'use client';

// Constants
import { contractAbi as contractAbiGovernance, contractAddress as contractAddressGovernance } from "@/constants/governance";
import { contractAbi as contractAbiToken, contractAddress as contractAddressToken } from "@/constants/token";
import { config } from "@/app/config";

// Wagmi
import { useWriteContract, useWatchBlockNumber, useAccount, useWatchContractEvent } from "wagmi";

// React
import { useEffect, useState } from "react";

// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { FaSpinner } from "react-icons/fa";

const Governance = () => {

  // Constants //

  const { address } = useAccount();
  const { toast } = useToast();
  const { writeContract } = useWriteContract();
  const { writeContractAsync } = useWriteContract();

  // State //

  const [ currentBlockNumber, setCurrentBlockNumber ] = useState(0);
  const [ proposals, setProposals ] = useState();
  const [ proposalInput, setProposalInput ] = useState("");
  const [ votes, setVotes ] = useState({});
  const [ totalSupply, setTotalSupply ] = useState(0);

  // Watch //
  useWatchBlockNumber({
    onBlockNumber(blockNumber) {
      setCurrentBlockNumber(Number(blockNumber))
    },
  });

  /*useWatchContractEvent({
    address: contractAddressGovernance,
    abi: contractAbiGovernance,
    fromBlock: BigInt(12602042),
    toBlock: "latest",
    eventName: "ProposalCreated",
    onLogs(logs) {
      console.log(logs)
      if (logs.length > 0) {
        logs.forEach(element => {
          getProposalState(element.args.proposalId)
          .then((response) => {
            element.args.state = beautifulState(response)
          })
          getProposalVotes(element.args.proposalId)
          .then((response) => {
            console.log(response)
            element.args.votes = response
          }).catch((error) => {
            console.log(error)
          })
        });
        setTimeout(() => {
          setProposals(logs)
        }, 1000)
      }
    }
  });*/


  const unwatch = config.watchContractEvent({
    address: contractAbiGovernance,
    abi: contractAbiGovernance,
    eventName: 'ProposalCreated',
    fromBlock: BigInt(12602042),
    onLogs: (logs) => {
      if (logs.length > 0) {
        logs.forEach(element => {
          getProposalState(element.args.proposalId)
          .then((response) => {
            element.args.state = beautifulState(response)
          })
          getProposalVotes(element.args.proposalId)
          .then((response) => {
            element.args.votes = response
          }).catch((error) => {
            console.log(error)
          })
        });
        setTimeout(() => {
          setProposals(logs)
        }, 1000)
      }
    }
  })

  // Handle //
  const handleInputChange = (event) => {
    setProposalInput(event.target.value);
  };

  const handleVoteSubmit = (index, proposalId) => {
    const vote = votes[index];
    if (vote !== undefined && proposalId) {
      writeContract({
        abi: contractAbiGovernance,
        address: contractAddressGovernance,
        functionName: "castVote",
        args: [
          [proposalId],
          [vote]
        ]
      }, {onError: (error) => {
        toast({
          variant: "destructive",
          title: "Vote error.",
          description: error.cause.message
        }) 
      }});

    } else {

      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "No vote selected for proposal"
      })
    }
  };

  const handleAddProposal = async() => {
    try {
      await writeContractAsync({
        abi: contractAbiGovernance,
        address: contractAddressGovernance,
        functionName: "propose",
        args: [
          ["0x0000000000000000000000000000000000000000"],
          [0],
          ["0x"],
          proposalInput
        ]
      }, {onError: (error) => {
        toast({
          variant: "destructive",
          title: "Vote error",
          description: error.cause.message
        })
      }})

      setProposalInput("");
    } catch (err) {
      console.log(err);
    }
  };


  const handleVoteSelection = (index, choice) => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [index]: choice
    }));
  };

  // Other functions //

  const timeRemaining = (voteEnd) => {
    if (voteEnd && currentBlockNumber) {
      const blocksRemaining = voteEnd - currentBlockNumber;
      const secondsPerBlock = 13;
      const timeRemainingInSeconds = blocksRemaining * secondsPerBlock;
      const timeRemainingInMinutes = timeRemainingInSeconds / 60;
      const timeRemainingInHours = timeRemainingInMinutes / 60;
      return Math.round(timeRemainingInHours / 24);
    }
    return 0;
  };

  /// Proposal State
  /// 0: Proposed
  /// 1: Active
  /// 2: Succeeded
  /// 3: Queued
  /// 4: Executed
  /// 5: Defeated
  /// 6: Expired
  const getProposalState = (proposalId) => {
    const data = config.readContract({
      abi: contractAbiGovernance,
      address: contractAddressGovernance,
      functionName: 'state',
      account: address,
      args: [
        [proposalId]
      ]
    })
    return data;
  }

  const getProposalVotes = (proposalId) => {
    const data = config.readContract({
      abi: contractAbiGovernance,
      address: contractAddressGovernance,
      functionName: 'proposalVotes',
      args: [
        [proposalId],
      ]
    })
    return data;
  }

  const getTotalSupply = () => {
    const data = config.readContract({
      abi: contractAbiToken,
      address: contractAddressToken,
      functionName: 'totalSupply'
    })
    return data;
  }

  const beautifulState = (state) => {
    const expr = state
    switch (expr) {
      case 0:
        return "Proposed";
      case 1:
        return "Active";
      case 2:
        return "Succeeded";
      case 3:
        return "Queued";
      case 4:
        return "Executed";
      case 5:
        return "Defeated";
      case 6:
        return "Expired";
    }
  }

  useEffect(() => {
    getTotalSupply().then((response) => {
      setTotalSupply(Number(BigInt(response))) 
    });
  }, [])

  return (
    <div>
      <h2 className="text-3xl font-bold">Proposals</h2>
      <div className="flex my-4">
        <Input onChange={handleInputChange} type="text" placeholder="Description" className="w-1/2 mr-4 rounded-xl"/>
        <Button onClick={handleAddProposal}>Add New Proposal</Button>
        <Button className="ml-2">
          <Link href="/dashboard/governance/delegate">
          Delegate
          </Link>
        </Button>
      </div>
      {!proposals ? (
        <div className="flex items-center gap-2">
          <FaSpinner className="spinner"/> 
          <span>Loading...</span>
        </div>
      ) : (
        <>
          <div className="flex flex-col w-2/3 max-height-60 overflow-y-scroll">
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
                <div className="px-4 flex justify-between">
                  {proposal.args.state === "Active" ? (<div>
                    <div className="mb-2 font-bold">Cast your vote</div>
                    <div className="w-36 text-center">
                      <div
                        className={`border rounded-xl p-1 mb-1 cursor-pointer ${votes[index] === 1 ? 'bg-green-200' : ''}`}
                        onClick={() => handleVoteSelection(index, 1)}
                      >
                        For
                      </div>
                      <div
                        className={`border rounded-xl p-1 mb-1 cursor-pointer ${votes[index] === 0 ? 'bg-red-200' : ''}`}
                        onClick={() => handleVoteSelection(index, 0)}
                      >
                        Against
                      </div>
                      <div
                        className={`border rounded-xl p-1 mb-1 cursor-pointer ${votes[index] === 2 ? 'bg-yellow-200' : ''}`}
                        onClick={() => handleVoteSelection(index, 2)}
                      >
                        Abstain
                      </div>
                      <Button className="border rounded-xl p-1 my-1 w-36" onClick={() => handleVoteSubmit(index, proposal.args.proposalId)}>
                        Vote
                      </Button>
                    </div>
                  </div>):(<></>)}
                  <div>
                    <div className="mb-2 font-bold">Current results</div>
                    <div className="text-center">
                      <div>For: {Number(proposal.args.votes[1]) / Number(totalSupply)} %</div>
                      <div>Against: {Number(proposal.args.votes[0]) / Number(totalSupply)} %</div>
                      <div>Abstain: {Number(proposal.args.votes[2]) / Number(totalSupply)} %</div>
                    </div>
                  </div>
                  <div className="content-end">
                    <Badge variant="secondary">{proposal.args.state}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Governance;