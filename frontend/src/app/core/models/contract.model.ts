export interface PollOption {
  description: string;
  voteCount: string; 
}


export interface PollDetails {
  id: number;
  creator: string;
  description: string;
  options: PollOption[];
  deadline: Date;
  active: boolean;
  totalVotePowerCast: string; 
  totalOptions: number;
}

export interface ContractConstants {
  minimumGohoToCreatePoll: string;
  minimumGohoToVote: string;
  maxPollDurationInDays: number;
}