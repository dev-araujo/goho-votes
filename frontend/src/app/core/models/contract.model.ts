export interface PollOption {
  description: string;
  voteCount: string; 
}


export interface PollDetails {
  id: number;
  creator: string;
  title:string
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

export interface CreatePollData {
  title: string;
  description: string;
  options: string[];
  durationInDays: number;
}
