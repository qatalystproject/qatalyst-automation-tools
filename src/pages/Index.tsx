
import { useState } from "react";
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

const Index = () => {
  const [openaiKey, setOpenaiKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("generator");
  const [generatedGherkin, setGeneratedGherkin] = useState("");
  const [playwrightCode, setPlaywrightCode] = useState("");
  const [testCases, setTestCases] = useState<any[]>([]);
  const [executionResults, setExecutionResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleAuthentication = (key: string) => {
    setOpenaiKey(key);
    setIsAuthenticated(true);
    toast({
      title: "Authentication Success",
      description: "OpenAI API Key has been configured successfully.",
    });
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
    
    // Create test cases for each scenario
    const newTestCases = scenarios.map(scenario => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: scenario.title,
      status: "draft" as const,
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

  const handleExecutionResults = (results: any[]) => {
    setExecutionResults(prev => [...prev, ...results]);
  };

  const handleNavigateToGenerator = () => {
    setActiveTab("generator");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Play className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Test Automation Platform
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              {isAuthenticated && (
                <div className="flex items-center space-x-2 text-sm text-green-400">
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  <span>API Connected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {!isAuthenticated ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <AuthenticationCard onAuthenticate={handleAuthentication} />
          </div>
        ) : (
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
                apiKey={openaiKey}
                onGherkinGenerated={handleGherkinGenerated}
                onNavigateToPlaywright={() => setActiveTab("playwright")}
                generatedGherkin={generatedGherkin}
              />
            </TabsContent>

            <TabsContent value="playwright">
              <PlaywrightGenerator 
                apiKey={openaiKey}
                initialGherkin={generatedGherkin}
                onPlaywrightGenerated={handlePlaywrightGenerated}
                onNavigateToExecution={() => setActiveTab("execution")}
                onExecutionResults={handleExecutionResults}
              />
            </TabsContent>

            <TabsContent value="management">
              <TestCaseManager 
                testCases={testCases} 
                onTestCasesChange={setTestCases}
                onNavigateToGenerator={handleNavigateToGenerator}
              />
            </TabsContent>

            <TabsContent value="execution">
              <ExecutionEngine executionResults={executionResults} />
            </TabsContent>

            <TabsContent value="export">
              <Card className="p-6 bg-slate-800 border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">Export to GitHub</h3>
                <p className="text-slate-400 mb-4">Export your test cases and automation scripts to a GitHub repository.</p>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Connect GitHub Repository
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;
