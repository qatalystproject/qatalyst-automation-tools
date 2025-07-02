
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Wand2, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GherkinGeneratorProps {
  apiKey: string;
}

const GherkinGenerator = ({ apiKey }: GherkinGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [generatedGherkin, setGeneratedGherkin] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateGherkin = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      // Simulate API call to OpenAI
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedGherkin);
    toast({
      title: "Copied",
      description: "Gherkin scenarios copied to clipboard!",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Wand2 className="h-5 w-5 mr-2 text-blue-400" />
            Prompt-Based Generator
          </CardTitle>
          <CardDescription className="text-slate-400">
            Describe your test scenario and let AI generate Gherkin syntax
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            onClick={generateGherkin}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {isGenerating ? "Generating..." : "Generate Gherkin"}
          </Button>
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
        <CardContent>
          <Textarea
            value={generatedGherkin}
            readOnly
            placeholder="Generated Gherkin scenarios will appear here..."
            className="bg-slate-900 border-slate-600 text-green-400 font-mono min-h-[300px] resize-none"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default GherkinGenerator;
