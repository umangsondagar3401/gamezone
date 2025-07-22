export type Choice = "rock" | "paper" | "scissors";

export interface GameState {
  playerChoice: Choice | null;
  computerChoice: Choice | null;
  playerScore: number;
  computerScore: number;
  result: string | null;
  isAnimating: boolean;
}

export interface MoveSelectionProps {
  choices: Choice[];
  choicesIcons: Record<Choice, React.ReactNode>;
  setShowResult: React.Dispatch<React.SetStateAction<boolean>>;
  setShowChoices: React.Dispatch<React.SetStateAction<boolean>>;
}
