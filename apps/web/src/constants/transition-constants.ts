export interface TransitionDefinition {
  id: string;
  name: string;
  type: "fade-in" | "fade-out" | "cross-dissolve" | "zoom-in" | "zoom-out" | "slide-left" | "slide-right";
}

export const TRANSITIONS: TransitionDefinition[] = [
  { id: "fade-in", name: "Fade In", type: "fade-in" },
  { id: "fade-out", name: "Fade Out", type: "fade-out" },
  { id: "cross-dissolve", name: "Cross Dissolve", type: "cross-dissolve" },
  { id: "zoom-in", name: "Zoom In", type: "zoom-in" },
  { id: "zoom-out", name: "Zoom Out", type: "zoom-out" },
  { id: "slide-left", name: "Slide Left", type: "slide-left" },
  { id: "slide-right", name: "Slide Right", type: "slide-right" },
];