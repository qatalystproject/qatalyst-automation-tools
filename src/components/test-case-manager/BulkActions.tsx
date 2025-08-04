import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Archive, Trash2 } from "lucide-react";
import { TestCase } from "./types";

interface BulkActionsProps {
  filteredTestCases: TestCase[];
  selectedTestCases: string[];
  onSelectAll: (checked: boolean) => void;
  onBulkStatusUpdate: (status: "active" | "archived") => void;
  onBulkDelete: () => void;
}

export const BulkActions = ({ 
  filteredTestCases, 
  selectedTestCases, 
  onSelectAll, 
  onBulkStatusUpdate, 
  onBulkDelete 
}: BulkActionsProps) => {
  if (filteredTestCases.length === 0) return null;

  return (
    <Card className="bg-midnight-navy border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Checkbox
              checked={selectedTestCases.length === filteredTestCases.length}
              onCheckedChange={onSelectAll}
            />
            <span className="text-primary-text text-sm">
              {selectedTestCases.length > 0 
                ? `${selectedTestCases.length} selected`
                : "Select all"
              }
            </span>
          </div>
          {selectedTestCases.length > 0 && (
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => onBulkStatusUpdate("active")}
                className="bg-emerald-neon hover:bg-emerald-neon/80 text-dark-slate"
              >
                <Check className="h-4 w-4 mr-1" />
                Set Active
              </Button>
              <Button
                size="sm"
                onClick={() => onBulkStatusUpdate("archived")}
                className="bg-muted-text hover:bg-muted-text/80 text-primary-text"
              >
                <Archive className="h-4 w-4 mr-1" />
                Archive
              </Button>
              <Button
                size="sm"
                onClick={onBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};