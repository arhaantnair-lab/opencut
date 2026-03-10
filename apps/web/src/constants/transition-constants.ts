export interface TransitionDefinition {
    id: string;
    name: string;
    type: "fade-in" | "fade-out" | "cross-dissolve";
}

export const TRANSITIONS: TransitionDefinition[] = [
    {
        id: "fade-in",
        name: "Fade In",
        type: "fade-in",
    },
    {
        id: "fade-out",
        name: "Fade Out",
        type: "fade-out",
    },
    {
        id: "cross-dissolve",
        name: "Cross Dissolve",
        type: "cross-dissolve",
    },
];