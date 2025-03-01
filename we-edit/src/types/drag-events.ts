import type { UniqueIdentifier } from "@dnd-kit/core";

export interface DragStartEvent {
  active: {
    id: UniqueIdentifier;
  };
}

export interface DragEndEvent {
  active: {
    id: UniqueIdentifier;
  };
  over: {
    id: UniqueIdentifier;
    data?: {
      current?: {
        sortable?: {
          index?: number;
        };
      };
    };
  } | null;
}
