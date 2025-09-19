import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Globe, Code, FileText, Copy } from 'lucide-react';
import { ScraperService } from '@/services/ScraperService';
import type { ScraperResult } from '@/types/scraper';

export const WebScraper = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScraperResult | null>(null);
  const [generatedGherkin, setGeneratedGherkin] = useState('');
  const [generatedPlaywright, setGeneratedPlaywright] = useState('');
  const { toast } = useToast();

  const handleScrape = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const scraperResult = await ScraperService.analyzeWebsite({
        url: url.trim(),
        maxDepth: 1,
        includeHiddenElements: false
      });

      if (scraperResult.error) {
        throw new Error(scraperResult.error);
      }

      setResult(scraperResult);
      
      // Generate Gherkin and Playwright from flows
      const gherkin = ScraperService.generateGherkinFromFlows(scraperResult);
      const playwright = ScraperService.generatePlaywrightFromFlows(scraperResult);
      
      setGeneratedGherkin(gherkin);
      setGeneratedPlaywright(playwright);

      toast({
        title: "Success",
        description: `Found ${scraperResult.elements.length} elements and ${scraperResult.flows.length} flows`
      });
    } catch (error) {
      console.error('Scraping error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze website",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: `${type} copied to clipboard`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Website Scraper & Test Generator</h2>
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Enter website URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleScrape()}
            className="flex-1"
          />
          <Button 
            onClick={handleScrape} 
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Website'
            )}
          </Button>
        </div>
      </Card>

      {result && (
        <Tabs defaultValue="flows" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="flows">Flows ({result.flows.length})</TabsTrigger>
            <TabsTrigger value="elements">Elements ({result.elements.length})</TabsTrigger>
            <TabsTrigger value="gherkin">Gherkin</TabsTrigger>
            <TabsTrigger value="playwright">Playwright</TabsTrigger>
          </TabsList>

          <TabsContent value="flows" className="space-y-4">
            {result.flows.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No user flows detected</p>
              </Card>
            ) : (
              result.flows.map((flow, index) => (
                <Card key={index} className="p-4">
                  <h3 className="font-semibold mb-3">{flow.title}</h3>
                  <div className="space-y-2">
                    {flow.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{step.action}</Badge>
                        <code className="bg-muted px-2 py-1 rounded text-xs flex-1">
                          {step.locator}
                        </code>
                        {step.value && (
                          <span className="text-muted-foreground">= "{step.value}"</span>
                        )}
                        {step.expected && (
                          <span className="text-muted-foreground">→ "{step.expected}"</span>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="elements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.elements.map((element, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{element.type}</Badge>
                    <span className="font-medium text-sm">{element.name}</span>
                  </div>
                  <code className="text-xs bg-muted p-2 rounded block break-all">
                    {element.locator}
                  </code>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gherkin" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <h3 className="font-semibold">Generated Gherkin</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generatedGherkin, 'Gherkin')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96">
                {generatedGherkin}
              </pre>
            </Card>
          </TabsContent>

          <TabsContent value="playwright" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <h3 className="font-semibold">Generated Playwright</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generatedPlaywright, 'Playwright')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96">
                {generatedPlaywright}
              </pre>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};