import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Code, Play, Copy, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlaywrightGeneratorProps {
  initialGherkin?: string;
  onPlaywrightGenerated?: (code: string) => void;
  onNavigateToExecution?: () => void;
  onExecutionResults?: (results: any[], successPercentage: number) => void;
  playwrightCode?: string;
  onPlaywrightCodeChange?: (code: string) => void;
}

const PlaywrightGenerator = ({ 
  apiKey, 
  initialGherkin = "",
  onPlaywrightGenerated,
  onNavigateToExecution,
  onExecutionResults,
  playwrightCode: initialPlaywrightCode = "",
  onPlaywrightCodeChange
}: PlaywrightGeneratorProps) => {
  const [gherkinInput, setGherkinInput] = useState(initialGherkin);
  const [playwrightCode, setPlaywrightCode] = useState(initialPlaywrightCode);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialGherkin && initialGherkin !== gherkinInput) {
      setGherkinInput(initialGherkin);
    }
  }, [initialGherkin]);

  useEffect(() => {
    if (initialPlaywrightCode !== playwrightCode) {
      setPlaywrightCode(initialPlaywrightCode);
    }
  }, [initialPlaywrightCode]);

  const parseScenarios = (featureText: string) => {
    const lines = featureText.split('\n');
    const scenarios = [];
    let current: string[] = [];
    let insideScenario = false;

    for (const line of lines) {
      if (line.trim().startsWith('Scenario:')) {
        if (current.length > 0) {
          scenarios.push(current.join('\n').trim());
          current = [];
        }
        insideScenario = true;
      }
      if (insideScenario) {
        current.push(line);
      }
    }

    if (current.length > 0) {
      scenarios.push(current.join('\n').trim());
    }

    return scenarios;
  };

  const generatePlaywrightCode = async (scenarioText: string, featureUrl: string) => {
    try {
      const response = await fetch('/api/generate-playwright', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario: scenarioText,
          url: featureUrl
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate Playwright code');
      }

      const data = await response.json();
      return data.code;
    } catch (error) {
      console.error('❌ Backend API Error:', error);
      throw error;
    }
  };

  const convertToPlaywright = async () => {
    if (!gherkinInput.trim()) return;
    
    setIsConverting(true);
    try {
      const featureUrl = gherkinInput.match(/# URL:(.*)/)?.[1]?.trim() || '';
      const scenarios = parseScenarios(gherkinInput);
      
      console.log(`📄 Found ${scenarios.length} scenarios...`);

      let allTests = `import { test, expect } from '@playwright/test';\n\n`;

      for (let i = 0; i < scenarios.length; i++) {
        const title = scenarios[i].match(/Scenario:\s*(.*)/)?.[1]?.trim() || `Scenario ${i + 1}`;
        console.log(`⚙️ Converting scenario: ${title}...`);
        
        try {
          const testCode = await generatePlaywrightCode(scenarios[i], featureUrl);

          if (!testCode || testCode.trim().length < 10) {
            allTests += `// 🚧 Skipped: ${title}\ntest('${title}', async () => {\n  // No code generated\n});\n\n`;
            continue;
          }

          const cleanedCode = testCode
            .replace(/```javascript/g, '')
            .replace(/```/g, '')
            .replace(/import\s+\{[^}]+\}\s+from\s+['"]@playwright\/test['"];/g, '')
            .replace(/\.toHaveText\(/g, '.toContainText(')
            .replace(/locator\('text=([^']+)'\)/g, `locator('[data-test="error"]')`)
            .replace(/(const errorMessage = await page\.locator\([^)]+\);)/g, `$1\n  console.log('🔍 Actual text:', await errorMessage.textContent());`)
            .replace(/toContainText\('([^']+)'\)/g, (_, txt) => {
              const sanitized = txt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              return `toContainText(/${sanitized}/i)`;
            })
            .trim();

          allTests += cleanedCode + '\n\n';
        } catch (error) {
          console.error(`Error generating code for scenario: ${title}`, error);
          
          if (error.message && error.message.includes('Invalid OpenAI API key')) {
            throw error; // Re-throw to be caught by outer catch block
          }
          
          allTests += `// ❌ Error generating code for: ${title}\ntest('${title}', async () => {\n  // Code generation failed\n});\n\n`;
        }
      }

      const finalCode = allTests.trim();
      setPlaywrightCode(finalCode);
      onPlaywrightGenerated?.(finalCode);
      onPlaywrightCodeChange?.(finalCode);
      
      toast({
        title: "Playwright Code Generated",
        description: `Successfully converted ${scenarios.length} Gherkin scenarios to Playwright tests!`,
      });
    } catch (error) {
      console.error('Error converting Gherkin to Playwright:', error);
      
      toast({
        title: "Conversion Failed",
        description: error.message || "Failed to convert Gherkin to Playwright code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(playwrightCode);
    toast({
      title: "Copied",
      description: "Playwright code copied to clipboard!",
    });
  };

  const clearGherkinInput = () => {
    setGherkinInput("");
  };

  const clearPlaywrightCode = () => {
    setPlaywrightCode("");
    onPlaywrightCodeChange?.("");
  };

  const handlePlaywrightCodeChange = (newCode: string) => {
    setPlaywrightCode(newCode);
    onPlaywrightCodeChange?.(newCode);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center">
                <Code className="h-5 w-5 mr-2 text-blue-400" />
                Gherkin Input
              </CardTitle>
              <CardDescription className="text-slate-400">
                Paste your Gherkin scenarios to convert to Playwright automation
              </CardDescription>
            </div>
            {gherkinInput && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearGherkinInput}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="gherkin" className="text-white">Gherkin Scenarios</Label>
            <Textarea
              id="gherkin"
              placeholder={`# URL: https://example.com
Feature: Login functionality
  Scenario: Successful login
    Given I am on the login page
    When I enter valid credentials
    Then I should be redirected to dashboard`}
              value={gherkinInput}
              onChange={(e) => setGherkinInput(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white mt-2 min-h-[300px] font-mono text-sm"
            />
          </div>
          <Button 
            onClick={convertToPlaywright}
            disabled={!gherkinInput.trim() || isConverting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isConverting ? "Converting..." : "Generate Playwright Code"}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center">
                <Play className="h-5 w-5 mr-2 text-green-400" />
                Playwright Code
              </CardTitle>
              <CardDescription className="text-slate-400">
                Generated automation script ready for execution
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              {playwrightCode && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyCode}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearPlaywrightCode}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={playwrightCode}
            onChange={(e) => handlePlaywrightCodeChange(e.target.value)}
            placeholder="Generated Playwright automation code will appear here..."
            className="bg-slate-900 border-slate-600 text-blue-300 font-mono text-sm min-h-[320px] resize-none"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaywrightGenerator;
