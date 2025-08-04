import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { TestCase } from "./types";

interface EditTestCaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingTestCase: TestCase | null;
  onEditingTestCaseChange: (testCase: TestCase) => void;
  onSave: () => void;
}

export const EditTestCaseDialog = ({ 
  isOpen, 
  onOpenChange, 
  editingTestCase, 
  onEditingTestCaseChange, 
  onSave 
}: EditTestCaseDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-midnight-navy border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-primary-text">Edit Test Case</DialogTitle>
          <DialogDescription className="text-secondary-text">
            Make changes to your test case. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {editingTestCase && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-primary-text">Name</Label>
              <Input
                id="name"
                value={editingTestCase.name}
                onChange={(e) => onEditingTestCaseChange({...editingTestCase, name: e.target.value})}
                className="bg-dark-slate border-slate-600 text-primary-text focus:border-electric-blue"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-primary-text">Description</Label>
              <Input
                id="description"
                value={editingTestCase.description}
                onChange={(e) => onEditingTestCaseChange({...editingTestCase, description: e.target.value})}
                className="bg-dark-slate border-slate-600 text-primary-text focus:border-electric-blue"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content" className="text-primary-text">Content</Label>
              <Textarea
                id="content"
                value={editingTestCase.content || ''}
                onChange={(e) => onEditingTestCaseChange({...editingTestCase, content: e.target.value})}
                className="bg-dark-slate border-slate-600 text-primary-text min-h-[200px] font-mono text-sm focus:border-electric-blue"
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button
            onClick={onSave}
            className="bg-gradient-to-r from-emerald-neon to-aqua-green hover:from-emerald-neon/80 hover:to-aqua-green/80 text-dark-slate"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};