import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Play, Settings, FileText, Download, GitBranch } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AuthenticationCard from "@/components/AuthenticationCard";
import GherkinGenerator from "@/components/GherkinGenerator";
import PlaywrightGenerator from "@/components/PlaywrightGenerator";
import TestCaseManager from "@/components/TestCaseManager";
import ExecutionEngine from "@/components/ExecutionEngine";
import ExportManager from "@/components/ExportManager";
import Homepage from "@/components/Homepage";
import Footer from "@/components/Footer";

const Index = () => {
  const [showHomepage, setShowHomepage] = useState(true);
  const [activeTab, setActiveTab] = useState("generator");
  const [generatedGherkin, setGeneratedGherkin] = useState("");
  const [playwrightCode, setPlaywrightCode] = useState("");
  const [testCases, setTestCases] = useState<any[]>([]);
  const [executionResults, setExecutionResults] = useState<any[]>([]);
  const [successPercentage, setSuccessPercentage] = useState(0);
  const [isHeadlessMode, setIsHeadlessMode] = useState(true);
  const [runningTestCases, setRunningTestCases] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGetStarted = () => {
    setShowHomepage(false);
  };

  const extractScenariosFromGherkin = (gherkin: string) => {
    const lines = gherkin.split('\n');
    const scenarios = [];
    let currentScenario = null;
    let scenarioContent = [];
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('Scenario:')) {
        if (currentScenario) {
          scenarios.push({
            title: currentScenario,
            content: scenarioContent.join('\n')
          });
        }
        currentScenario = trimmedLine.replace('Scenario:', '').trim();
        scenarioContent = [line];
      } else if (currentScenario) {
        scenarioContent.push(line);
      }
    });
    
    if (currentScenario) {
      scenarios.push({
        title: currentScenario,
        content: scenarioContent.join('\n')
      });
    }
    
    return scenarios;
  };

  const handleGherkinGenerated = (gherkin: string, title: string) => {
    setGeneratedGherkin(gherkin);
    
    // Extract individual scenarios from Gherkin
    const scenarios = extractScenariosFromGherkin(gherkin);
    
    // Create test cases for each scenario with updated status type
    const newTestCases = scenarios.map(scenario => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: scenario.title,
      status: "active" as const,
      type: "gherkin" as const,
      lastModified: new Date().toISOString().split('T')[0],
      description: `Auto-generated from ${title}`,
      content: scenario.content
    }));
    
    // Add new test cases to existing ones (don't replace)
    setTestCases(prev => [...prev, ...newTestCases]);
    
    toast({
      title: "Test Cases Created",
      description: `Generated ${scenarios.length} test case(s) from Gherkin scenarios.`,
    });
  };

  const handlePlaywrightGenerated = (code: string) => {
    setPlaywrightCode(code);
  };

  const handleResetGherkinFields = () => {
    setGeneratedGherkin("");
  };

  // Make reset function available globally for PlaywrightGenerator
  useEffect(() => {
    window.resetGherkinFields = handleResetGherkinFields;
    return () => {
      delete window.resetGherkinFields;
    };
  }, []);

  const handleExecutionResults = (results: any[], percentage: number) => {
    setExecutionResults(results);
    setSuccessPercentage(percentage);
    // Auto-navigate to Execute tab
    setActiveTab("execution");
  };

  const handleExecutionResultsUpdate = (results: any[], percentage: number) => {
    setExecutionResults(results);
    setSuccessPercentage(percentage);
  };

  const handleRunSelectedTests = async (selectedTestIds: string[]) => {
    const selectedTests = testCases.filter(tc => selectedTestIds.includes(tc.id) && tc.status === "active");
    
    if (selectedTests.length === 0) {
      toast({
        title: "No Active Tests Selected",
        description: "Please select active test cases to run.",
        variant: "destructive",
      });
      return;
    }

    // Redirect to execution tab and let ExecutionEngine handle the test running
    setActiveTab("execution");
    
    toast({
      title: "Redirecting to Execute",
      description: `Navigate to Execute tab to run ${selectedTests.length} selected test(s).`,
    });
  };

  const handleNavigateToGenerator = () => {
    setActiveTab("generator");
  };

  if (showHomepage) {
    return (
      <>
        <Homepage onGetStarted={handleGetStarted} />
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setShowHomepage(true)}>
              <div className="h-16 w-16 rounded-lg overflow-hidden">
                <img
                  src="/lovable-uploads/269d3e8a-a51d-4e23-9146-715eea456ae5.png" 
                  alt="QAtalyst Logo" 
                  className="h-full w-full object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                QAtalyst
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-slate-700">
            <TabsTrigger value="generator" className="data-[state=active]:bg-blue-600">
              <FileText className="h-4 w-4 mr-2" />
              Generator
            </TabsTrigger>
            <TabsTrigger value="playwright" className="data-[state=active]:bg-blue-600">
              <Play className="h-4 w-4 mr-2" />
              Playwright
            </TabsTrigger>
            <TabsTrigger value="management" className="data-[state=active]:bg-blue-600">
              <Settings className="h-4 w-4 mr-2" />
              Test Cases
            </TabsTrigger>
            <TabsTrigger value="execution" className="data-[state=active]:bg-blue-600">
              <Play className="h-4 w-4 mr-2" />
              Execute
            </TabsTrigger>
            <TabsTrigger value="export" className="data-[state=active]:bg-blue-600">
              <GitBranch className="h-4 w-4 mr-2" />
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <GherkinGenerator 
              onGherkinGenerated={handleGherkinGenerated}
              onNavigateToPlaywright={() => setActiveTab("playwright")}
              generatedGherkin={generatedGherkin}
              onGherkinChange={setGeneratedGherkin}
            />
          </TabsContent>

          <TabsContent value="playwright">
            <PlaywrightGenerator 
              initialGherkin={generatedGherkin}
              onPlaywrightGenerated={handlePlaywrightGenerated}
              onNavigateToExecution={() => setActiveTab("execution")}
              onExecutionResults={handleExecutionResults}
              playwrightCode={playwrightCode}
              onPlaywrightCodeChange={setPlaywrightCode}
            />
          </TabsContent>

          <TabsContent value="management">
            <TestCaseManager 
              testCases={testCases} 
              onTestCasesChange={setTestCases}
              onNavigateToGenerator={handleNavigateToGenerator}
              onRunSelectedTests={handleRunSelectedTests}
            />
          </TabsContent>

          <TabsContent value="execution">
            <ExecutionEngine 
              executionResults={executionResults}
              successPercentage={successPercentage}
              isHeadlessMode={isHeadlessMode}
              onHeadlessModeChange={setIsHeadlessMode}
              onExecutionResults={handleExecutionResultsUpdate}
              testCases={testCases}
              runningTestCases={runningTestCases}
            />
          </TabsContent>

          <TabsContent value="export">
            <ExportManager 
              gherkinContent={generatedGherkin}
              playwrightCode={playwrightCode}
              testCases={testCases}
              executionResults={executionResults}
              successPercentage={successPercentage}
            />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
