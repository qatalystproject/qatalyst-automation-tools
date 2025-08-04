import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Edit, Trash2 } from "lucide-react";
import { TestCase } from "./types";

interface TestCaseCardProps {
  testCase: TestCase;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onEdit: (testCase: TestCase) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: "active" | "archived") => void;
}

export const TestCaseCard = ({ 
  testCase, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onStatusChange 
}: TestCaseCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-neon text-dark-slate";
      case "archived": return "bg-muted-text text-primary-text";
      default: return "bg-muted-text text-primary-text";
    }
  };

  return (
    <Card className="bg-midnight-navy border-slate-700 hover:border-electric-blue/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(testCase.id, checked as boolean)}
            />
            <div className="p-2 bg-dark-slate rounded-lg">
              <FileText className="h-5 w-5 text-electric-blue" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-primary-text">{testCase.name}</h3>
                <div className="flex space-x-1">
                  <Badge 
                    className={`${getStatusColor(testCase.status)} cursor-pointer`}
                    onClick={() => {
                      const nextStatus = testCase.status === "active" ? "archived" : "active";
                      onStatusChange(testCase.id, nextStatus);
                    }}
                  >
                    {testCase.status}
                  </Badge>
                  <Badge variant="outline" className="border-slate-600 text-secondary-text">
                    {testCase.type}
                  </Badge>
                </div>
              </div>
              <p className="text-secondary-text mb-2">{testCase.description}</p>
              <p className="text-xs text-muted-text">Last modified: {testCase.lastModified}</p>
              {testCase.content && (
                <div className="mt-3 p-2 bg-dark-slate rounded text-xs text-emerald-neon font-mono max-h-20 overflow-hidden">
                  {testCase.content.split('\n').slice(0, 3).join('\n')}
                  {testCase.content.split('\n').length > 3 && '...'}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(testCase)}
              className="border-slate-600 text-secondary-text hover:bg-dark-slate hover:text-electric-blue"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(testCase.id)}
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};