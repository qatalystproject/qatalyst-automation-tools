
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Play, Square, RotateCcw, Eye, EyeOff, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TestResult {
  id: string;
  name: string;
  status: "running" | "passed" | "failed" | "pending";
  duration: string;
  details: string;
}

const ExecutionEngine = () => {
  const [isHeadless, setIsHeadless] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([
    {
      id: "1",
      name: "Login Functionality Test",
      status: "passed",
      duration: "2.3s",
      details: "All login scenarios passed successfully"
    },
    {
      id: "2",
      name: "E-commerce Checkout Flow", 
      status: "failed",
      duration: "5.7s",
      details: "Payment gateway timeout error"
    },
    {
      id: "3",
      name: "API Response Validation",
      status: "pending",
      duration: "-",
      details: "Waiting to run"
    }
  ]);
  
  const { toast } = useToast();

  const runTests = async () => {
    setIsRunning(true);
    
    // Simulate test execution
    for (let i = 0; i < testResults.length; i++) {
      setTestResults(prev => prev.map((test, index) => 
        index === i ? { ...test, status: "running" as const } : test
      ));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random pass/fail
      const passed = Math.random() > 0.3;
      setTestResults(prev => prev.map((test, index) => 
        index === i ? { 
          ...test, 
          status: passed ? "passed" as const : "failed" as const,
          duration: `${(Math.random() * 5 + 1).toFixed(1)}s`
        } : test
      ));
    }
    
    setIsRunning(false);
    toast({
      title: "Test Execution Complete",
      description: "All test cases have been executed. Check the results below.",
    });
  };

  const stopTests = () => {
    setIsRunning(false);
    setTestResults(prev => prev.map(test => 
      test.status === "running" ? { ...test, status: "pending" as const } : test
    ));
    toast({
      title: "Tests Stopped",
      description: "Test execution has been stopped.",
    });
  };

  const rerunFailedTests = () => {
    const failedTests = testResults.filter(test => test.status === "failed");
    if (failedTests.length === 0) {
      toast({
        title: "No Failed Tests",
        description: "There are no failed tests to rerun.",
      });
      return;
    }
    
    toast({
      title: "Rerunning Failed Tests",
      description: `Rerunning ${failedTests.length} failed test(s).`,
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
      default: return "bg-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Play className="h-5 w-5 mr-2 text-blue-400" />
              Execution Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isHeadless ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                <Label htmlFor="headless" className="text-white">
                  {isHeadless ? "Headless Mode" : "Visible Mode"}
                </Label>
              </div>
              <Switch
                id="headless"
                checked={isHeadless}
                onCheckedChange={setIsHeadless}
              />
            </div>
            <div className="text-xs text-slate-400">
              {isHeadless 
                ? "Tests will run in the background without opening browser windows"
                : "Browser windows will be visible during test execution"
              }
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
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Run All Tests
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
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Rerun Failed
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-green-600/20 rounded">
                <div className="text-lg font-bold text-green-400">
                  {testResults.filter(t => t.status === "passed").length}
                </div>
                <div className="text-xs text-green-300">Passed</div>
              </div>
              <div className="p-2 bg-red-600/20 rounded">
                <div className="text-lg font-bold text-red-400">
                  {testResults.filter(t => t.status === "failed").length}
                </div>
                <div className="text-xs text-red-300">Failed</div>
              </div>
              <div className="p-2 bg-slate-600/20 rounded">
                <div className="text-lg font-bold text-slate-400">
                  {testResults.filter(t => t.status === "pending").length}
                </div>
                <div className="text-xs text-slate-300">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Test Results</CardTitle>
          <CardDescription className="text-slate-400">
            Real-time execution results and test reports
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutionEngine;
