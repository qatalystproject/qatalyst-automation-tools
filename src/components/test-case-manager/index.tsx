import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TestCase, TestCaseManagerProps } from "./types";
import { TestCaseHeader } from "./TestCaseHeader";
import { TestCaseSearch } from "./TestCaseSearch";
import { BulkActions } from "./BulkActions";
import { TestCaseCard } from "./TestCaseCard";
import { EmptyState } from "./EmptyState";
import { EditTestCaseDialog } from "./EditTestCaseDialog";

const TestCaseManager = ({ testCases, onTestCasesChange, onNavigateToGenerator }: TestCaseManagerProps) => {
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

  const handleBulkDelete = () => {
    const updatedTestCases = testCases.filter(tc => !selectedTestCases.includes(tc.id));
    onTestCasesChange(updatedTestCases);
    toast({
      title: "Test Cases Deleted",
      description: `${selectedTestCases.length} test case(s) have been deleted.`,
    });
    setSelectedTestCases([]);
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

  return (
    <div className="space-y-6">
      <TestCaseHeader 
        activeCount={activeTestCases.length}
        archivedCount={archivedTestCases.length}
        onNewTestCase={handleNewTestCase}
      />

      <TestCaseSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <BulkActions
        filteredTestCases={filteredTestCases}
        selectedTestCases={selectedTestCases}
        onSelectAll={handleSelectAll}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onBulkDelete={handleBulkDelete}
      />

      <div className="grid gap-4">
        {filteredTestCases.map((testCase) => (
          <TestCaseCard
            key={testCase.id}
            testCase={testCase}
            isSelected={selectedTestCases.includes(testCase.id)}
            onSelect={handleSelectTestCase}
            onEdit={openEditDialog}
            onDelete={deleteTestCase}
            onStatusChange={updateTestCaseStatus}
          />
        ))}
      </div>

      {filteredTestCases.length === 0 && (
        <EmptyState 
          searchTerm={searchTerm}
          onNewTestCase={handleNewTestCase}
        />
      )}

      <EditTestCaseDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editingTestCase={editingTestCase}
        onEditingTestCaseChange={setEditingTestCase}
        onSave={saveTestCase}
      />
    </div>
  );
};

export default TestCaseManager;