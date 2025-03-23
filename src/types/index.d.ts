export interface Onboarding {
    steps: Step[];
    showSkip?: boolean;
    onSkip?: () => void;
    showPrev?: boolean;
    onFinish?: () => void;
    onStart?: () => void;
    onNext?: () => void;
    onPrev?: () => void;
}

export interface OnboardingProps extends Onboarding {
    destroy: () => void;
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