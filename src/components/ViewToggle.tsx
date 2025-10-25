import { Grid2X2, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewType = "two" | "three" | "list";

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex gap-2 animate-fade-in">
      <Button
        variant={currentView === "two" ? "default" : "outline"}
        size="icon"
        onClick={() => onViewChange("two")}
        className="transition-bounce hover:scale-110"
      >
        <Grid2X2 className="h-4 w-4" />
      </Button>
      <Button
        variant={currentView === "three" ? "default" : "outline"}
        size="icon"
        onClick={() => onViewChange("three")}
        className="transition-bounce hover:scale-110"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        variant={currentView === "list" ? "default" : "outline"}
        size="icon"
        onClick={() => onViewChange("list")}
        className="transition-bounce hover:scale-110"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
