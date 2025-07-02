
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Code, Play, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlaywrightGeneratorProps {
  apiKey: string;
}

const PlaywrightGenerator = ({ apiKey }: PlaywrightGeneratorProps) => {
  const [gherkinInput, setGherkinInput] = useState("");
  const [playwrightCode, setPlaywrightCode] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const convertToPlaywright = async () => {
    if (!gherkinInput.trim()) return;
    
    setIsConverting(true);
    try {
      // Simulate AI conversion
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const mockPlaywrightCode = `import { test, expect } from '@playwright/test';

test.describe('Generated Test Suite', () => {
  test('should perform automated test based on Gherkin scenario', async ({ page }) => {
    // Given: Navigate to the application
    await page.goto('https://example.com');
    
    // When: Perform the required actions
    await page.fill('[data-testid="username"]', 'testuser');
    await page.fill('[data-testid="password"]', 'testpass');
    await page.click('[data-testid="login-button"]');
    
    // Then: Verify the expected results
    await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
    
    // Additional assertions
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Dashboard');
  });

  test('should handle error scenarios', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Test invalid login
    await page.fill('[data-testid="username"]', 'invalid');
    await page.fill('[data-testid="password"]', 'invalid');
    await page.click('[data-testid="login-button"]');
    
    // Verify error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
  });
});`;

      setPlaywrightCode(mockPlaywrightCode);
      toast({
        title: "Playwright Code Generated",
        description: "Gherkin scenarios have been converted to Playwright automation scripts!",
      });
    } catch (error) {
      toast({
        title: "Conversion Failed",
        description: "Failed to convert Gherkin to Playwright code. Please try again.",
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Code className="h-5 w-5 mr-2 text-blue-400" />
            Gherkin Input
          </CardTitle>
          <CardDescription className="text-slate-400">
            Paste your Gherkin scenarios to convert to Playwright automation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="gherkin" className="text-white">Gherkin Scenarios</Label>
            <Textarea
              id="gherkin"
              placeholder={`Feature: Login functionality
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
            {playwrightCode && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyCode}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <textarea
            value={playwrightCode}
            readOnly
            placeholder="Generated Playwright automation code will appear here..."
            className="w-full h-96 bg-slate-900 border border-slate-600 rounded p-3 text-blue-300 font-mono text-sm resize-none"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaywrightGenerator;
