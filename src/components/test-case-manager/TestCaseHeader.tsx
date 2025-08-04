import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TestCaseHeaderProps {
  activeCount: number;
  archivedCount: number;
  onNewTestCase: () => void;
}

export const TestCaseHeader = ({ activeCount, archivedCount, onNewTestCase }: TestCaseHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-primary-text">Test Case Management</h2>
        <p className="text-secondary-text">
          Manage, edit, and organize your test scenarios ({activeCount} active, {archivedCount} archived)
        </p>
      </div>
      <Button 
        onClick={onNewTestCase}
        className="bg-gradient-to-r from-electric-blue to-bright-cyan hover:from-electric-blue/80 hover:to-bright-cyan/80 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Test Case
      </Button>
    </div>
  );
};