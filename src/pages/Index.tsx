import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Play, Settings, FileText, Download, GitBranch, Atom, Zap, Cog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AuthenticationCard from "@/components/AuthenticationCard";
import GherkinGenerator from "@/components/GherkinGenerator";
import PlaywrightGenerator from "@/components/PlaywrightGenerator";
import TestCaseManager from "@/components/TestCaseManager";
import ExecutionEngine from "@/components/ExecutionEngine";
import ExportManager from "@/components/ExportManager";
import Footer from "@/components/Footer";

const Index = () => {
  const [openaiKey, setOpenaiKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("generator");
  const [generatedGherkin, setGeneratedGherkin] = useState("");
  const [playwrightCode, setPlaywrightCode] = useState("");
  const [testCases, setTestCases] = useState<any[]>([]);
  const [executionResults, setExecutionResults] = useState<any[]>([]);
  const [successPercentage, setSuccessPercentage] = useState(0);
  const [isHeadlessMode, setIsHeadlessMode] = useState(true);
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

  const handleExecutionResults = (results: any[], percentage: number) => {
    // Merge with existing results instead of replacing
    setExecutionResults(prev => [...prev, ...results]);
    setSuccessPercentage(percentage);
    // Auto-navigate to Execute tab
    setActiveTab("execution");
  };

  const handleExecutionResultsUpdate = (results: any[], percentage: number) => {
    // Merge with existing results instead of replacing
    setExecutionResults(prev => [...prev, ...results]);
    setSuccessPercentage(percentage);
  };

  const handleNavigateToGenerator = () => {
    setActiveTab("generator");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-slate via-midnight-navy to-dark-slate">
      {/* Header */}
      <div className="border-b border-slate-700 bg-midnight-navy/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16 rounded-xl overflow-hidden">
                <img 
                  src="/lovable-uploads/6e90bcc4-e6cf-4651-b20f-95748717815c.png" 
                  alt="QAtalyst Logo" 
                  className="h-full w-full object-contain"
                />
                {/* Logo overlay icons with glow effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <Cog className="h-6 w-6 text-electric-blue absolute top-1 left-1" style={{ filter: 'drop-shadow(0 0 4px #FFFFFF33)' }} />
                    <Atom className="h-5 w-5 text-bright-cyan absolute top-2 right-1" style={{ filter: 'drop-shadow(0 0 4px #FFFFFF33)' }} />
                    <Zap className="h-4 w-4 text-emerald-neon absolute bottom-1 right-2" style={{ filter: 'drop-shadow(0 0 4px #FFFFFF33)' }} />
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold font-sans">
                  <span className="text-bright-cyan" style={{ color: '#00F0FF' }}>QA</span>
                  <span className="text-[#5BC0FF]">talyst</span>
                </h1>
                <p className="text-lg text-secondary-text font-medium">Test Smarter. Ship Faster.</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isAuthenticated && (
                <div className="flex items-center space-x-2 text-sm text-emerald-neon">
                  <div className="h-2 w-2 rounded-full bg-emerald-neon animate-pulse"></div>
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
            <TabsList className="grid w-full grid-cols-5 bg-midnight-navy border-slate-700">
              <TabsTrigger value="generator" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-electric-blue data-[state=active]:to-bright-cyan data-[state=active]:text-white">
                <FileText className="h-4 w-4 mr-2" />
                Generator
              </TabsTrigger>
              <TabsTrigger value="playwright" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-electric-blue data-[state=active]:to-bright-cyan data-[state=active]:text-white">
                <Play className="h-4 w-4 mr-2" />
                Playwright
              </TabsTrigger>
              <TabsTrigger value="management" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-electric-blue data-[state=active]:to-bright-cyan data-[state=active]:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Test Cases
              </TabsTrigger>
              <TabsTrigger value="execution" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-electric-blue data-[state=active]:to-bright-cyan data-[state=active]:text-white">
                <Play className="h-4 w-4 mr-2" />
                Execute
              </TabsTrigger>
              <TabsTrigger value="export" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-electric-blue data-[state=active]:to-bright-cyan data-[state=active]:text-white">
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
                onGherkinChange={setGeneratedGherkin}
              />
            </TabsContent>

            <TabsContent value="playwright">
              <PlaywrightGenerator 
                apiKey={openaiKey}
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
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Index;
