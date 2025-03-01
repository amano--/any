import { cva } from "class-variance-authority";

export const treeItemStyles = cva(
  [
    "flex items-center gap-2 p-2 rounded-lg",
    "transition-colors duration-200",
    "hover:bg-accent",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  ],
  {
    variants: {
      isDragging: {
        true: "opacity-50",
        false: "opacity-100",
      },
      isOver: {
        true: "bg-accent/50",
        false: "",
      },
      depth: {
        0: "ml-0",
        1: "ml-6",
        2: "ml-12",
        3: "ml-18",
        4: "ml-24",
        5: "ml-30",
      },
    },
    defaultVariants: {
      isDragging: false,
      isOver: false,
      depth: 0,
    },
  },
);

export const dragOverlayStyles = cva(
  [
    "flex items-center gap-2 p-2 rounded-lg",
    "bg-background border-2 border-primary",
    "shadow-lg",
  ],
  {
    variants: {
      isDragging: {
        true: "cursor-grabbing",
        false: "cursor-grab",
      },
    },
    defaultVariants: {
      isDragging: true,
    },
  },
);
