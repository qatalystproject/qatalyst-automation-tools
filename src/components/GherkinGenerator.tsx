
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, Copy, Download, Upload, FileText, X, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GherkinGeneratorProps {
  apiKey: string;
  onGherkinGenerated?: (gherkin: string, title: string) => void;
  onNavigateToPlaywright?: () => void;
  generatedGherkin?: string;
}

const GherkinGenerator = ({ 
  apiKey, 
  onGherkinGenerated, 
  onNavigateToPlaywright,
  generatedGherkin: initialGherkin = ""
}: GherkinGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [generatedGherkin, setGeneratedGherkin] = useState(initialGherkin);
  const [isGenerating, setIsGenerating] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const { toast } = useToast();

  const extractScenarioTitle = (gherkin: string) => {
    const lines = gherkin.split('\n');
    const featureLine = lines.find(line => line.trim().startsWith('Feature:'));
    if (featureLine) {
      return featureLine.replace('Feature:', '').trim();
    }
    const scenarioLine = lines.find(line => line.trim().startsWith('Scenario:'));
    if (scenarioLine) {
      return scenarioLine.replace('Scenario:', '').trim();
    }
    return 'Generated Test Case';
  };

  const generateFromPrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockGherkin = `Feature: ${prompt}
  As a user
  I want to perform automated testing
  So that I can ensure quality

  Scenario: Basic functionality test
    Given I am on the application page
    When I perform the required action
    Then I should see the expected result
    And the system should behave correctly

  Scenario: Error handling test
    Given I am on the application page
    When I provide invalid input
    Then I should see an error message
    And the system should handle the error gracefully`;

      setGeneratedGherkin(mockGherkin);
      const title = extractScenarioTitle(mockGherkin);
      onGherkinGenerated?.(mockGherkin, title);
      
      toast({
        title: "Gherkin Generated",
        description: "Test scenarios have been successfully generated!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate Gherkin scenarios. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => row.split(','));
        setCsvData(rows);
      };
      reader.readAsText(file);
      
      toast({
        title: "CSV Uploaded",
        description: `File "${file.name}" has been uploaded successfully.`,
      });
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a valid CSV file.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const generateFromCsv = async () => {
    if (!csvData.length) return;
    
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockGeneratedTests = csvData.map((row, index) => {
        if (index === 0) return "";
        return `Feature: Test Case ${index}
  Scenario: Testing ${row[0] || 'functionality'}
    Given I have the test data: ${row.join(', ')}
    When I execute the test steps
    Then I should verify the expected results`;
      }).filter(test => test).join('\n\n');

      setGeneratedGherkin(mockGeneratedTests);
      const title = `CSV Generated Tests - ${csvFile?.name}`;
      onGherkinGenerated?.(mockGeneratedTests, title);
      
      toast({
        title: "Tests Generated",
        description: `Successfully generated ${csvData.length - 1} test scenarios from CSV data.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate tests from CSV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const removeFile = () => {
    setCsvFile(null);
    setCsvData([]);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedGherkin);
    toast({
      title: "Copied",
      description: "Gherkin scenarios copied to clipboard!",
    });
  };

  const createPlaywright = () => {
    if (generatedGherkin) {
      onNavigateToPlaywright?.();
      toast({
        title: "Navigating to Playwright",
        description: "Opening Playwright generator with your Gherkin scenarios.",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Wand2 className="h-5 w-5 mr-2 text-blue-400" />
            Gherkin Generator
          </CardTitle>
          <CardDescription className="text-slate-400">
            Generate test scenarios from prompt or CSV data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="prompt" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger value="prompt">From Prompt</TabsTrigger>
              <TabsTrigger value="csv">From CSV</TabsTrigger>
            </TabsList>
            
            <TabsContent value="prompt" className="space-y-4">
              <div>
                <Label htmlFor="prompt" className="text-white">Test Description</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe what you want to test (e.g., 'Login functionality with valid and invalid credentials')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white mt-2 min-h-[120px]"
                />
              </div>
              <Button 
                onClick={generateFromPrompt}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {isGenerating ? "Generating..." : "Generate Gherkin"}
              </Button>
            </TabsContent>
            
            <TabsContent value="csv" className="space-y-4">
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                {!csvFile ? (
                  <div>
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <span className="text-blue-400 hover:text-blue-300">Click to upload</span>
                      <span className="text-slate-400"> your CSV file</span>
                    </label>
                    <input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-slate-700 p-3 rounded">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-green-400" />
                      <span className="text-white text-sm">{csvFile.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              {csvData.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-white font-medium text-sm">Preview ({csvData.length} rows)</h4>
                  <div className="bg-slate-900 rounded p-2 max-h-24 overflow-auto">
                    <table className="text-xs text-slate-300 w-full">
                      <tbody>
                        {csvData.slice(0, 3).map((row, index) => (
                          <tr key={index}>
                            {row.slice(0, 3).map((cell, cellIndex) => (
                              <td key={cellIndex} className="pr-2 py-1 border-r border-slate-700">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={generateFromCsv}
                disabled={!csvData.length || isGenerating}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {isGenerating ? "Processing CSV..." : "Generate from CSV"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Generated Gherkin</CardTitle>
              <CardDescription className="text-slate-400">
                AI-generated test scenarios in Gherkin format
              </CardDescription>
            </div>
            {generatedGherkin && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={generatedGherkin}
            readOnly
            placeholder="Generated Gherkin scenarios will appear here..."
            className="bg-slate-900 border-slate-600 text-green-400 font-mono min-h-[300px] resize-none"
          />
          {generatedGherkin && (
            <Button 
              onClick={createPlaywright}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Create Playwright
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GherkinGenerator;
