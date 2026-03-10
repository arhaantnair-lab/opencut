import type { TimelineTrack, TimelineElement } from "@/types/timeline";
import { ClipTransition, findAdjacentClips, resolveCrossDissolveOpacity } from "./clip-transitions";

export class TransitionManager {
  private transitions: Map<string, ClipTransition> = new Map();
  
  private projectTransitions: Map<string, ClipTransition[]> = new Map();
  
  setTransitions(transitions: ClipTransition[]) {
    this.transitions.clear();
    for (const transition of transitions) {
      this.transitions.set(transition.id, transition);
    }
  }
  
  addTransition(transition: ClipTransition) {
    this.transitions.set(transition.id, transition);
  }
  
  removeTransition(transitionId: string) {
    this.transitions.delete(transitionId);
  }
  
  getTransition(transitionId: string): ClipTransition | undefined {
    return this.transitions.get(transitionId);
  }
  
  getTransitionForClip(clipId: string): ClipTransition | undefined {
    for (const transition of this.transitions.values()) {
      if (transition.fromClipId === clipId || transition.toClipId === clipId) {
        return transition;
      }
    }
    return undefined;
  }
  
  resolveOpacityAtTime(
    clipId: string,
    clipStartTime: number,
    clipDuration: number,
    currentTime: number,
    baseOpacity: number
  ): number {
    const transition = this.getTransitionForClip(clipId);
    return resolveCrossDissolveOpacity(
      transition,
      clipId,
      clipStartTime,
      clipDuration,
      currentTime,
      baseOpacity
    );
  }
  
  findTransitionsInTracks(tracks: TimelineTrack[]): void {
    for (const track of tracks) {
      for (const element of track.elements) {
        const { nextClip, nextTrackId } = findAdjacentClips(tracks, element.id, track.id);
        
        if (nextClip && nextTrackId) {
          const existingTransition = this.getTransitionBetweenClips(element.id, nextClip.id);
          if (!existingTransition) {
            // Auto-detect potential cross-dissolve points
          }
        }
      }
    }
  }
  
  getTransitionBetweenClips(fromClipId: string, toClipId: string): ClipTransition | undefined {
    for (const transition of this.transitions.values()) {
      if (transition.fromClipId === fromClipId && transition.toClipId === toClipId) {
        return transition;
      }
    }
    return undefined;
  }
  
  getAllTransitions(): ClipTransition[] {
    return Array.from(this.transitions.values());
  }
}

export const transitionManager = new TransitionManager();