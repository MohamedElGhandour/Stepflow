export interface StepflowProps {
  steps: Step[];
  showSkip?: boolean;
  onSkip?: () => void;
  showPrev?: boolean;
  onFinish?: () => void;
  onStart?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export interface Step {
  target: string;
  content: {
    header: string;
    description: string;
  };
  onNext?: () => void;
  onPrev?: () => void;
}
