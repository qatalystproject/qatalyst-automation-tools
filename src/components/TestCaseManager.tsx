
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Edit, Trash2, Plus, Search, Save, Check, Archive, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TestCase {
  id: string;
  name: string;
  status: "active" | "archived";
  type: "gherkin" | "playwright";
  lastModified: string;
  description: string;
  content?: string;
}

interface TestCaseManagerProps {
  testCases: TestCase[];
  onTestCasesChange: (testCases: TestCase[]) => void;
  onNavigateToGenerator: () => void;
  onRunSelectedTests?: (selectedTestIds: string[]) => void;
}

const TestCaseManager = ({ testCases, onTestCasesChange, onNavigateToGenerator, onRunSelectedTests }: TestCaseManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTestCase, setEditingTestCase] = useState<TestCase | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);
  const { toast } = useToast();

  const filteredTestCases = testCases.filter(testCase =>
    testCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testCase.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeTestCases = testCases.filter(tc => tc.status === "active");
  const archivedTestCases = testCases.filter(tc => tc.status === "archived");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-600";
      case "archived": return "bg-gray-600";
      default: return "bg-gray-600";
    }
  };

  const deleteTestCase = (id: string) => {
    const updatedTestCases = testCases.filter(tc => tc.id !== id);
    onTestCasesChange(updatedTestCases);
    toast({
      title: "Test Case Deleted",
      description: "The test case has been removed successfully.",
    });
  };

  const updateTestCaseStatus = (id: string, newStatus: "active" | "archived") => {
    const updatedTestCases = testCases.map(tc => 
      tc.id === id ? { ...tc, status: newStatus, lastModified: new Date().toISOString().split('T')[0] } : tc
    );
    onTestCasesChange(updatedTestCases);
    toast({
      title: "Status Updated",
      description: `Test case status changed to ${newStatus}.`,
    });
  };

  const handleSelectTestCase = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedTestCases(prev => [...prev, id]);
    } else {
      setSelectedTestCases(prev => prev.filter(tcId => tcId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTestCases(filteredTestCases.map(tc => tc.id));
    } else {
      setSelectedTestCases([]);
    }
  };

  const handleBulkStatusUpdate = (status: "active" | "archived") => {
    const updatedTestCases = testCases.map(tc => 
      selectedTestCases.includes(tc.id) 
        ? { ...tc, status, lastModified: new Date().toISOString().split('T')[0] }
        : tc
    );
    onTestCasesChange(updatedTestCases);
    setSelectedTestCases([]);
    toast({
      title: "Bulk Update Complete",
      description: `${selectedTestCases.length} test case(s) updated to ${status}.`,
    });
  };

  const openEditDialog = (testCase: TestCase) => {
    setEditingTestCase({ ...testCase });
    setIsEditDialogOpen(true);
  };

  const saveTestCase = () => {
    if (!editingTestCase) return;
    
    const updatedTestCases = testCases.map(tc => 
      tc.id === editingTestCase.id ? { 
        ...editingTestCase, 
        lastModified: new Date().toISOString().split('T')[0] 
      } : tc
    );
    onTestCasesChange(updatedTestCases);
    setIsEditDialogOpen(false);
    setEditingTestCase(null);
    
    toast({
      title: "Test Case Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleNewTestCase = () => {
    onNavigateToGenerator();
    toast({
      title: "Redirecting to Generator",
      description: "Create a new test case using the Generator tab.",
    });
  };

  const handleRunSelectedTests = () => {
    if (selectedTestCases.length === 0) {
      toast({
        title: "No Tests Selected",
        description: "Please select test cases to run.",
        variant: "destructive",
      });
      return;
    }

    const activeSelectedTests = selectedTestCases.filter(id => {
      const testCase = testCases.find(tc => tc.id === id);
      return testCase && testCase.status === "active";
    });

    if (activeSelectedTests.length === 0) {
      toast({
        title: "No Active Tests Selected",
        description: "Please select active test cases to run.",
        variant: "destructive",
      });
      return;
    }

    onRunSelectedTests?.(activeSelectedTests);
    setSelectedTestCases([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Test Case Management</h2>
          <p className="text-slate-400">
            Manage, edit, and organize your test scenarios ({activeTestCases.length} active, {archivedTestCases.length} archived)
          </p>
        </div>
        <Button 
          onClick={handleNewTestCase}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Test Case
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search test cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {filteredTestCases.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={selectedTestCases.length === filteredTestCases.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-white text-sm">
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
                    onClick={handleRunSelectedTests}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Run Selected
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBulkStatusUpdate("active")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Set Active
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBulkStatusUpdate("archived")}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredTestCases.map((testCase) => (
          <Card key={testCase.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    checked={selectedTestCases.includes(testCase.id)}
                    onCheckedChange={(checked) => handleSelectTestCase(testCase.id, checked as boolean)}
                  />
                  <div className="p-2 bg-slate-700 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{testCase.name}</h3>
                      <div className="flex space-x-1">
                        <Badge 
                          className={`${getStatusColor(testCase.status)} text-white cursor-pointer`}
                          onClick={() => {
                            const nextStatus = testCase.status === "active" ? "archived" : "active";
                            updateTestCaseStatus(testCase.id, nextStatus);
                          }}
                        >
                          {testCase.status}
                        </Badge>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          {testCase.type}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-slate-400 mb-2">{testCase.description}</p>
                    <p className="text-xs text-slate-500">Last modified: {testCase.lastModified}</p>
                    {testCase.content && (
                      <div className="mt-3 p-2 bg-slate-900 rounded text-xs text-green-400 font-mono max-h-20 overflow-hidden">
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
                    onClick={() => openEditDialog(testCase)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteTestCase(testCase.id)}
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTestCases.length === 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Test Cases Found</h3>
            <p className="text-slate-400 mb-4">
              {searchTerm ? "No test cases match your search criteria." : "Test cases will appear here when generated from the Generator tab."}
            </p>
            <Button 
              onClick={handleNewTestCase}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Test Case
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Test Case</DialogTitle>
            <DialogDescription className="text-slate-400">
              Make changes to your test case. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingTestCase && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-white">Name</Label>
                <Input
                  id="name"
                  value={editingTestCase.name}
                  onChange={(e) => setEditingTestCase({...editingTestCase, name: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Input
                  id="description"
                  value={editingTestCase.description}
                  onChange={(e) => setEditingTestCase({...editingTestCase, description: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content" className="text-white">Content</Label>
                <Textarea
                  id="content"
                  value={editingTestCase.content || ''}
                  onChange={(e) => setEditingTestCase({...editingTestCase, content: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white min-h-[200px] font-mono text-sm"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={saveTestCase}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestCaseManager;
