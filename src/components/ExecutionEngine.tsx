import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Square, RotateCcw, CheckCircle, XCircle, Clock, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TestResult {
  id: string;
  name: string;
  status: "running" | "passed" | "failed" | "pending" | "archived";
  duration: string;
  details: string;
  error?: string;
}

interface ExecutionEngineProps {
  executionResults?: TestResult[];
  successPercentage?: number;
  isHeadlessMode?: boolean;
  onHeadlessModeChange?: (headless: boolean) => void;
  onExecutionResults?: (results: TestResult[], percentage: number) => void;
  testCases?: any[];
}

const ExecutionEngine = ({ 
  executionResults = [], 
  successPercentage = 0,
  isHeadlessMode = true,
  onHeadlessModeChange,
  onExecutionResults,
  testCases = []
}: ExecutionEngineProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>(executionResults);
  
  const { toast } = useToast();

  useEffect(() => {
    if (executionResults.length > 0) {
      setTestResults(executionResults);
    }
  }, [executionResults]);

  const simulateVisibleExecution = async (testName: string) => {
    console.log(`🌐 Opening browser window for: ${testName}`);
    toast({
      title: "Browser Opening",
      description: `Opening browser for test: ${testName}`,
    });
    
    // Simulate browser actions with delays
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`🔗 Navigating to test URL...`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`⌨️ Interacting with page elements...`);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`✅ Test execution completed for: ${testName}`);
  };

  const runTests = async () => {
    // Get active test cases from testCases prop
    const activeTestCases = testCases.filter(tc => tc.status === "active");
    
    if (activeTestCases.length === 0) {
      toast({
        title: "No Active Tests Available",
        description: "Please ensure you have active test cases to execute.",
        variant: "destructive",
      });
      return;
    }
    
    // Filter test results to only include active ones based on testCases
    const activeTestResults = testResults.filter(test => {
      const correspondingTestCase = testCases.find(tc => tc.name === test.name);
      return correspondingTestCase && correspondingTestCase.status === "active";
    });
    
    setIsRunning(true);
    
    toast({
      title: "Running Active Tests",
      description: `Executing ${activeTestCases.length} active test case(s) in headless mode. Archived tests are skipped.`,
    });
    
    const updatedResults = [...testResults];
    const detailedFailureReasons = [
      "Assertion failed: Expected text 'Welcome' but found 'Hello'",
      "Element with selector '[data-testid=\"login-button\"]' not found",
      "Timeout: Element '[placeholder=\"Username\"]' was not visible after 30s",
      "Expected URL to contain '/dashboard' but got '/login'",
      "Assertion failed: Expected element to be visible but it was hidden",
      "Network request failed: GET /api/users returned 404",
      "Element '[data-test=\"submit\"]' is not clickable at this point",
      "Expected 5 items but found 3 in the list"
    ];
    
    // Only run tests that have active status in testCases
    for (let i = 0; i < updatedResults.length; i++) {
      const correspondingTestCase = testCases.find(tc => tc.name === updatedResults[i].name);
      
      // Skip if test case doesn't exist or is archived
      if (!correspondingTestCase || correspondingTestCase.status === "archived") {
        continue;
      }
      
      // Set test to running
      updatedResults[i] = { ...updatedResults[i], status: "running" as const };
      setTestResults([...updatedResults]);
      
      // Simulate test execution time in headless mode
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Determine test result
      const passed = Math.random() > 0.3;
      const errorMessage = passed ? undefined : detailedFailureReasons[Math.floor(Math.random() * detailedFailureReasons.length)];
      
      updatedResults[i] = { 
        ...updatedResults[i], 
        status: passed ? "passed" as const : "failed" as const,
        duration: `${(Math.random() * 5 + 1).toFixed(1)}s`,
        details: passed ? "Test passed successfully" : "Test failed - assertion error",
        error: errorMessage
      };
      
      setTestResults([...updatedResults]);
    }
    
    setIsRunning(false);
    
    // Calculate success percentage only for active tests
    const activeResults = updatedResults.filter(r => {
      const correspondingTestCase = testCases.find(tc => tc.name === r.name);
      return correspondingTestCase && correspondingTestCase.status === "active";
    });
    const passedCount = activeResults.filter(r => r.status === "passed").length;
    const newSuccessPercentage = activeResults.length > 0 ? Math.round((passedCount / activeResults.length) * 100) : 0;
    
    onExecutionResults?.(updatedResults, newSuccessPercentage);
    
    toast({
      title: "Test Execution Complete",
      description: `${activeResults.length} active test case(s) executed. Success rate: ${newSuccessPercentage}%`,
    });
  };

  const stopTests = () => {
    setIsRunning(false);
    const stoppedResults = testResults.map(test => 
      test.status === "running" ? { ...test, status: "pending" as const } : test
    );
    setTestResults(stoppedResults);
    
    toast({
      title: "Tests Stopped",
      description: "Test execution has been stopped.",
    });
  };

  const rerunFailedTests = async () => {
    const failedIndices = testResults
      .map((test, index) => test.status === "failed" ? index : -1)
      .filter(index => index !== -1);
      
    if (failedIndices.length === 0) {
      toast({
        title: "No Failed Tests",
        description: "There are no failed tests to rerun.",
      });
      return;
    }
    
    setIsRunning(true);
    
    toast({
      title: "Rerunning Failed Tests",
      description: `Rerunning ${failedIndices.length} failed test(s) in headless mode.`,
    });

    const updatedResults = [...testResults];
    
    for (const index of failedIndices) {
      // Set failed test to running
      updatedResults[index] = { ...updatedResults[index], status: "running" as const };
      setTestResults([...updatedResults]);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Higher chance of success on rerun
      const passed = Math.random() > 0.4;
      updatedResults[index] = { 
        ...updatedResults[index], 
        status: passed ? "passed" as const : "failed" as const,
        duration: `${(Math.random() * 5 + 1).toFixed(1)}s`,
        details: passed ? "Test passed on rerun" : "Test failed again - needs investigation"
      };
      
      setTestResults([...updatedResults]);
    }
    
    setIsRunning(false);
    
    // Update success percentage after rerun
    const activeResults = updatedResults.filter(r => {
      const correspondingTestCase = testCases.find(tc => tc.name === r.name);
      return correspondingTestCase && correspondingTestCase.status === "active";
    });
    const passedCount = activeResults.filter(r => r.status === "passed").length;
    const newSuccessPercentage = activeResults.length > 0 ? Math.round((passedCount / activeResults.length) * 100) : 0;
    
    onExecutionResults?.(updatedResults, newSuccessPercentage);
    
    toast({
      title: "Rerun Complete",
      description: `Failed tests rerun completed. New success rate: ${newSuccessPercentage}%`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />;
      case "passed": return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "failed": return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-yellow-600";
      case "passed": return "bg-green-600";
      case "failed": return "bg-red-600";
      case "archived": return "bg-slate-600";
      default: return "bg-slate-600";
    }
  };

  // Calculate summary statistics - read archived count from testCases
  const passedCount = testResults.filter(t => t.status === "passed").length;
  const failedCount = testResults.filter(t => t.status === "failed").length;
  const archivedCount = testCases.filter(tc => tc.status === "archived").length; // Read from testCases prop
  const runningCount = testResults.filter(t => t.status === "running").length;
  const totalTests = testResults.length;
  const currentSuccessRate = totalTests > 0 ? Math.round((passedCount / totalTests) * 100) : successPercentage;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Info className="h-5 w-5 mr-2 text-blue-400" />
              Execution Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 p-3 bg-slate-700 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-blue-400"></div>
              <span className="text-white font-medium">Headless Mode</span>
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Tests run in the background without opening browser windows for faster execution. Only active test cases will be executed.
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!isRunning ? (
              <Button 
                onClick={runTests}
                disabled={testResults.length === 0}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Run Active Tests (Headless)
              </Button>
            ) : (
              <Button 
                onClick={stopTests}
                variant="destructive"
                className="w-full"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Tests
              </Button>
            )}
            <Button 
              onClick={rerunFailedTests}
              disabled={failedCount === 0 || isRunning}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Rerun Failed ({failedCount})
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{currentSuccessRate}%</div>
                <div className="text-sm text-slate-300">Success Rate</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-green-600/20 rounded">
                  <div className="text-lg font-bold text-green-400">{passedCount}</div>
                  <div className="text-xs text-green-300">Passed</div>
                </div>
                <div className="p-2 bg-red-600/20 rounded">
                  <div className="text-lg font-bold text-red-400">{failedCount}</div>
                  <div className="text-xs text-red-300">Failed</div>
                </div>
                <div className="p-2 bg-slate-600/20 rounded">
                  <div className="text-lg font-bold text-slate-400">{archivedCount}</div>
                  <div className="text-xs text-slate-300">Archived</div>
                </div>
                <div className="p-2 bg-yellow-600/20 rounded">
                  <div className="text-lg font-bold text-yellow-400">{runningCount}</div>
                  <div className="text-xs text-yellow-300">Running</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Test Results</CardTitle>
          <CardDescription className="text-slate-400">
            Execution results from Playwright tests ({testResults.length} tests, only active test cases executed)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {testResults.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <h4 className="text-white font-medium">{result.name}</h4>
                    <p className="text-sm text-slate-400">{result.details}</p>
                    {result.status === "failed" && result.error && (
                      <p className="text-sm text-red-400 mt-1">Error: {result.error}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-400">{result.duration}</span>
                  <Badge className={`${getStatusColor(result.status)} text-white`}>
                    {result.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          {testResults.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Test Results</h3>
              <p className="text-slate-400">Test results will appear here after running Playwright tests.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutionEngine;
