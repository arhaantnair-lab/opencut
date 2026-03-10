"use client";

import { PanelView } from "@/components/editor/panels/assets/views/base-view";
import { DraggableItem } from "@/components/editor/panels/assets/draggable-item";
import { TRANSITIONS, type TransitionDefinition } from "@/constants/transition-constants";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
	TransitionLeftIcon, 
	TransitionRightIcon,
} from "@hugeicons/core-free-icons";
import { useCallback } from "react";
import { useEditor } from "@/hooks/use-editor";
import { useElementSelection } from "@/hooks/timeline/element/use-element-selection";

export function TransitionsView() {
	return (
		<PanelView title="Transitions">
			<TransitionsGrid transitions={TRANSITIONS} />
		</PanelView>
	);
}

function TransitionsGrid({ transitions }: { transitions: TransitionDefinition[] }) {
	return (
		<div
			className="grid gap-2"
			style={{ gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))" }}
		>
			{transitions.map((transition) => (
				<TransitionItem key={transition.id} transition={transition} />
			))}
		</div>
	);
}

function TransitionItem({ transition }: { transition: TransitionDefinition }) {
	const editor = useEditor();
	const { selectedElements } = useElementSelection();

	const handleAddToTimeline = useCallback(() => {
		if (selectedElements.length === 0) return;

		// Apply to the first selected element for now
		const { trackId, elementId } = selectedElements[0];
		
		editor.timeline.updateElements({
			updates: [
				{
					trackId,
					elementId,
					updates: {
						transitions: {
							in: { type: transition.type, duration: 1 },
							out: { type: transition.type, duration: 1 },
						},
					},
				},
			],
		});
	}, [editor, selectedElements, transition.type]);

	const icon = transition.type === "fade-in" ? TransitionLeftIcon : TransitionRightIcon;

	const preview = (
		<div className="flex size-full items-center justify-center bg-accent/50 text-accent-foreground">
			<HugeiconsIcon icon={icon} className="size-8" />
		</div>
	);

	return (
		<DraggableItem
			name={transition.name}
			preview={preview}
			dragData={{
				id: transition.id,
				name: transition.name,
				type: "transition",
				transitionType: transition.type,
			}}
			onAddToTimeline={handleAddToTimeline}
			aspectRatio={1}
			isRounded
			variant="card"
			containerClassName="w-full"
		/>
	);
}
