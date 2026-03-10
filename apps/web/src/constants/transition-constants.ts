export interface TransitionDefinition {
	id: string;
	name: string;
	type: "fade" | "cross-dissolve";
}

export const TRANSITIONS: TransitionDefinition[] = [
	{
		id: "fade",
		name: "Fade In / Out",
		type: "fade",
	},
	{
		id: "cross-dissolve",
		name: "Cross Dissolve",
		type: "cross-dissolve",
	},
];
