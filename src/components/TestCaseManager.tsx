
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit, Trash2, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TestCase {
  id: string;
  name: string;
  status: "draft" | "active" | "archived";
  type: "gherkin" | "playwright";
  lastModified: string;
  description: string;
  content?: string;
}

interface TestCaseManagerProps {
  testCases: TestCase[];
  onTestCasesChange: (testCases: TestCase[]) => void;
}

const TestCaseManager = ({ testCases, onTestCasesChange }: TestCaseManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredTestCases = testCases.filter(testCase =>
    testCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testCase.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-600";
      case "draft": return "bg-yellow-600";
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

  const updateTestCaseStatus = (id: string, newStatus: "draft" | "active" | "archived") => {
    const updatedTestCases = testCases.map(tc => 
      tc.id === id ? { ...tc, status: newStatus, lastModified: new Date().toISOString().split('T')[0] } : tc
    );
    onTestCasesChange(updatedTestCases);
    toast({
      title: "Status Updated",
      description: `Test case status changed to ${newStatus}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Test Case Management</h2>
          <p className="text-slate-400">Manage, edit, and organize your test scenarios</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
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

      <div className="grid gap-4">
        {filteredTestCases.map((testCase) => (
          <Card key={testCase.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
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
                            const nextStatus = testCase.status === "draft" ? "active" : 
                                             testCase.status === "active" ? "archived" : "draft";
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
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Test Case
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestCaseManager;
