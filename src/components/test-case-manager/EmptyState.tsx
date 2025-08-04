import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

interface EmptyStateProps {
  searchTerm: string;
  onNewTestCase: () => void;
}

export const EmptyState = ({ searchTerm, onNewTestCase }: EmptyStateProps) => {
  return (
    <Card className="bg-midnight-navy border-slate-700">
      <CardContent className="p-12 text-center">
        <FileText className="h-12 w-12 text-secondary-text mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-primary-text mb-2">No Test Cases Found</h3>
        <p className="text-secondary-text mb-4">
          {searchTerm ? "No test cases match your search criteria." : "Test cases will appear here when generated from the Generator tab."}
        </p>
        <Button 
          onClick={onNewTestCase}
          className="bg-gradient-to-r from-electric-blue to-bright-cyan hover:from-electric-blue/80 hover:to-bright-cyan/80 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Test Case
        </Button>
      </CardContent>
    </Card>
  );
};