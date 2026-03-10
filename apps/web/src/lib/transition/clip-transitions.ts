import type { TimelineTrack, TimelineElement } from "@/types/timeline";

export interface ClipTransition {
  id: string;
  type: "cross-dissolve";
  duration: number;
  fromClipId: string;
  toClipId: string;
  fromTrackId: string;
  toTrackId: string;
}

export function findAdjacentClips(
  tracks: TimelineTrack[],
  clipId: string,
  trackId: string
): { nextClip?: TimelineElement; nextTrackId?: string; prevClip?: TimelineElement; prevTrackId?: string } {
  let currentClip: TimelineElement | undefined;
  let currentTrack: TimelineTrack | undefined;
  
  for (const track of tracks) {
    const element = track.elements.find(el => el.id === clipId);
    if (element) {
      currentClip = element;
      currentTrack = track;
      break;
    }
  }
  
  if (!currentClip || !currentTrack) {
    return {};
  }
  
  const currentEnd = currentClip.startTime + currentClip.duration;
  const currentStart = currentClip.startTime;
  
  let nextClip: TimelineElement | undefined;
  let nextTrackId: string | undefined;
  let prevClip: TimelineElement | undefined;
  let prevTrackId: string | undefined;
  
  for (const track of tracks) {
    for (const element of track.elements) {
      if (element.id === clipId) continue;
      
      const elementStart = element.startTime;
      const elementEnd = element.startTime + element.duration;
      
      if (Math.abs(elementStart - currentEnd) < 0.1 && !nextClip) {
        nextClip = element;
        nextTrackId = track.id;
      }
      
      if (Math.abs(elementEnd - currentStart) < 0.1 && !prevClip) {
        prevClip = element;
        prevTrackId = track.id;
      }
    }
  }
  
  return { nextClip, nextTrackId, prevClip, prevTrackId };
}

export function resolveCrossDissolveOpacity(
  transition: ClipTransition | undefined,
  clipId: string,
  clipStartTime: number,
  clipDuration: number,
  currentTime: number,
  baseOpacity: number
): number {
  if (!transition) return baseOpacity;
  
  const transitionDurationMs = transition.duration * 1000;
  const clipEndTime = clipStartTime + clipDuration;
  
  if (transition.fromClipId === clipId) {
    const transitionStartTime = clipEndTime * 1000 - transitionDurationMs;
    const timeInTransition = currentTime - transitionStartTime;
    
    if (timeInTransition >= 0 && timeInTransition <= transitionDurationMs) {
      return 1 - (timeInTransition / transitionDurationMs);
    }
  }
  
  if (transition.toClipId === clipId) {
    const transitionStartTime = clipStartTime * 1000;
    const timeInTransition = currentTime - transitionStartTime;
    
    if (timeInTransition >= 0 && timeInTransition <= transitionDurationMs) {
      return timeInTransition / transitionDurationMs;
    }
  }
  
  return baseOpacity;
}