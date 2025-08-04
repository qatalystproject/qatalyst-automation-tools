import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TestCaseSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const TestCaseSearch = ({ searchTerm, onSearchChange }: TestCaseSearchProps) => {
  return (
    <Card className="bg-midnight-navy border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-secondary-text" />
          <Input
            placeholder="Search test cases..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-dark-slate border-slate-600 text-primary-text focus:border-electric-blue"
          />
        </div>
      </CardContent>
    </Card>
  );
};