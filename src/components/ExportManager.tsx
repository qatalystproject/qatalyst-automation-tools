
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, Download, FileText, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportManagerProps {
  gherkinContent?: string;
  playwrightCode?: string;
  testCases?: any[];
  executionResults?: any[];
  successPercentage?: number;
}

const ExportManager = ({
  gherkinContent = "",
  playwrightCode = "",
  testCases = [],
  executionResults = [],
  successPercentage = 0
}: ExportManagerProps) => {
  const { toast } = useToast();

  const exportGherkin = () => {
    if (!gherkinContent.trim()) {
      toast({
        title: "No Gherkin Content",
        description: "Please generate Gherkin scenarios first.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([gherkinContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gherkin-scenarios-${new Date().toISOString().split('T')[0]}.feature`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Gherkin Exported",
      description: "Gherkin scenarios have been downloaded successfully.",
    });
  };

  const exportPlaywright = () => {
    if (!playwrightCode.trim()) {
      toast({
        title: "No Playwright Code",
        description: "Please generate Playwright code first.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([playwrightCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playwright-tests-${new Date().toISOString().split('T')[0]}.spec.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Playwright Exported",
      description: "Playwright test code has been downloaded successfully.",
    });
  };

  const exportTestSummary = () => {
    const passedCount = executionResults.filter(r => r.status === "passed").length;
    const failedCount = executionResults.filter(r => r.status === "failed").length;
    const totalTests = executionResults.length;

    const summary = `# Test Execution Summary
Generated on: ${new Date().toLocaleString()}

## Overview
- Total Test Cases: ${testCases.length}
- Executed Tests: ${totalTests}
- Passed: ${passedCount}
- Failed: ${failedCount}
- Success Rate: ${successPercentage}%

## Test Cases
${testCases.map((testCase, index) => `
${index + 1}. ${testCase.name}
   Status: ${testCase.status}
   Type: ${testCase.type}
   Last Modified: ${testCase.lastModified}
   Description: ${testCase.description}
`).join('')}

## Execution Results
${executionResults.map((result, index) => `
${index + 1}. ${result.name}
   Status: ${result.status}
   Duration: ${result.duration}
   Details: ${result.details}
`).join('')}
`;

    const blob = new Blob([summary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-summary-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Test Summary Exported",
      description: "Complete test summary has been downloaded as markdown file.",
    });
  };

  const exportToGitHub = () => {
    toast({
      title: "GitHub Export",
      description: "GitHub integration feature coming soon. For now, use the individual export options.",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Export Options</CardTitle>
          <CardDescription className="text-slate-400">
            Download your test artifacts and reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={exportGherkin}
            disabled={!gherkinContent.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Gherkin (.feature)
          </Button>
          
          <Button
            onClick={exportPlaywright}
            disabled={!playwrightCode.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Export Playwright (.spec.js)
          </Button>
          
          <Button
            onClick={exportTestSummary}
            disabled={testCases.length === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Test Summary (.md)
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">GitHub Integration</CardTitle>
          <CardDescription className="text-slate-400">
            Export your test cases and automation scripts to GitHub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-slate-400">
              <p className="mb-2">GitHub export will include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Gherkin feature files</li>
                <li>Playwright test specifications</li>
                <li>Test execution reports</li>
                <li>CI/CD workflow configuration</li>
              </ul>
            </div>
            
            <Button
              onClick={exportToGitHub}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900"
            >
              <GitBranch className="h-4 w-4 mr-2" />
              Export to GitHub (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-white">Export Summary</CardTitle>
          <CardDescription className="text-slate-400">
            Current project statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{testCases.length}</div>
              <div className="text-sm text-slate-300">Test Cases</div>
            </div>
            <div className="p-3 bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{executionResults.length}</div>
              <div className="text-sm text-slate-300">Executed</div>
            </div>
            <div className="p-3 bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{successPercentage}%</div>
              <div className="text-sm text-slate-300">Success Rate</div>
            </div>
            <div className="p-3 bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-cyan-400">
                {gherkinContent ? '✓' : '○'}
              </div>
              <div className="text-sm text-slate-300">Gherkin Ready</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportManager;
