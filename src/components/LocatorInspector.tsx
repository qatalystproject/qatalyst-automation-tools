import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Target, History, Download, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocatorData {
  id: string;
  element: string;
  cssSelector: string;
  xpath: string;
  framework: string;
  timestamp: Date;
  context?: string;
}

interface LocatorInspectorProps {
  onLocatorGenerated?: (locator: LocatorData) => void;
}

export const LocatorInspector: React.FC<LocatorInspectorProps> = ({
  onLocatorGenerated
}) => {
  const [isInspecting, setIsInspecting] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('playwright');
  const [locatorHistory, setLocatorHistory] = useState<LocatorData[]>([]);
  const [selectedElement, setSelectedElement] = useState<LocatorData | null>(null);
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Smart CSS Selector Generation Algorithm
  const generateCSSSelector = (element: HTMLElement): string => {
    // Priority-based locator generation following QA best practices
    
    // 1. ID Attribute (highest priority)
    if (element.id) {
      return `#${element.id}`;
    }

    // 2. Name Attribute
    if (element.getAttribute('name')) {
      return `[name="${element.getAttribute('name')}"]`;
    }

    // 3. Data attributes (test-specific)
    const dataTestId = element.getAttribute('data-testid') || element.getAttribute('data-test');
    if (dataTestId) {
      return `[data-testid="${dataTestId}"]`;
    }

    // 4. Placeholder text
    const placeholder = element.getAttribute('placeholder');
    if (placeholder) {
      return `[placeholder="${placeholder}"]`;
    }

    // 5. Unique classes
    if (element.className) {
      const classes = element.className.split(' ').filter(cls => cls.trim());
      if (classes.length > 0) {
        const selector = `.${classes.join('.')}`;
        // Check if selector is unique
        if (document.querySelectorAll(selector).length === 1) {
          return selector;
        }
      }
    }

    // 6. Attribute combinations
    const type = element.getAttribute('type');
    const role = element.getAttribute('role');
    if (type || role) {
      let selector = element.tagName.toLowerCase();
      if (type) selector += `[type="${type}"]`;
      if (role) selector += `[role="${role}"]`;
      if (document.querySelectorAll(selector).length === 1) {
        return selector;
      }
    }

    // 7. Text content for buttons and links
    if (['BUTTON', 'A', 'SPAN'].includes(element.tagName)) {
      const text = element.textContent?.trim();
      if (text && text.length < 50) {
        return `${element.tagName.toLowerCase()}:contains("${text}")`;
      }
    }

    // 8. Structural selectors (fallback)
    return generateStructuralSelector(element);
  };

  const generateStructuralSelector = (element: HTMLElement): string => {
    const path: string[] = [];
    let current = element;

    while (current && current.tagName) {
      const tagName = current.tagName.toLowerCase();
      const parent = current.parentElement;
      
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          child => child.tagName === current.tagName
        );
        
        if (siblings.length > 1) {
          const index = siblings.indexOf(current) + 1;
          path.unshift(`${tagName}:nth-child(${index})`);
        } else {
          path.unshift(tagName);
        }
      } else {
        path.unshift(tagName);
      }

      current = parent as HTMLElement;
      
      // Stop at body or if we have a unique enough path
      if (!parent || tagName === 'body' || path.length > 5) break;
    }

    return path.join(' > ');
  };

  // XPath Generation
  const generateXPath = (element: HTMLElement): string => {
    // Text-based XPath for elements with text content
    const text = element.textContent?.trim();
    if (text && text.length < 50 && ['BUTTON', 'A', 'SPAN', 'DIV'].includes(element.tagName)) {
      return `//${element.tagName.toLowerCase()}[text()="${text}"]`;
    }

    // Attribute-based XPath
    const id = element.getAttribute('id');
    if (id) {
      return `//*[@id="${id}"]`;
    }

    const name = element.getAttribute('name');
    if (name) {
      return `//*[@name="${name}"]`;
    }

    const dataTestId = element.getAttribute('data-testid');
    if (dataTestId) {
      return `//*[@data-testid="${dataTestId}"]`;
    }

    // Structural XPath
    return generateStructuralXPath(element);
  };

  const generateStructuralXPath = (element: HTMLElement): string => {
    const path: string[] = [];
    let current = element;

    while (current && current.tagName) {
      const tagName = current.tagName.toLowerCase();
      const parent = current.parentElement;
      
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          child => child.tagName === current.tagName
        );
        
        if (siblings.length > 1) {
          const index = siblings.indexOf(current) + 1;
          path.unshift(`${tagName}[${index}]`);
        } else {
          path.unshift(tagName);
        }
      } else {
        path.unshift(tagName);
      }

      current = parent as HTMLElement;
      
      if (!parent || tagName === 'body') break;
    }

    return '/' + path.join('/');
  };

  // Framework-specific locator generation
  const generateFrameworkLocator = (cssSelector: string, xpath: string): string => {
    switch (selectedFramework) {
      case 'playwright':
        return `page.locator('${cssSelector}')`;
      case 'selenium':
        return `driver.find_element(By.CSS_SELECTOR, '${cssSelector}')`;
      case 'cypress':
        return `cy.get('${cssSelector}')`;
      case 'webdriverio':
        return `$('${cssSelector}')`;
      case 'testcafe':
        return `Selector('${cssSelector}')`;
      default:
        return cssSelector;
    }
  };

  // URL input handler
  const handleUrlLoad = () => {
    if (!currentUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    // Load URL in iframe for inspection
    if (iframeRef.current) {
      try {
        iframeRef.current.src = currentUrl;
        toast({
          title: "Loading",
          description: `Loading ${currentUrl} for inspection...`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Unable to load URL. Make sure it allows iframe embedding.",
          variant: "destructive"
        });
      }
    }
  };

  // Mock element inspection (in real implementation, this would interact with the iframe)
  const simulateElementInspection = () => {
    const mockElements = [
      {
        tag: 'button',
        attributes: { id: 'submit-btn', class: 'btn btn-primary', type: 'submit' },
        text: 'Submit'
      },
      {
        tag: 'input',
        attributes: { name: 'username', placeholder: 'Enter username', type: 'text' },
        text: ''
      },
      {
        tag: 'a',
        attributes: { href: '#', class: 'nav-link' },
        text: 'Home'
      }
    ];

    const randomElement = mockElements[Math.floor(Math.random() * mockElements.length)];
    
    // Create mock element for selector generation
    const mockEl = document.createElement(randomElement.tag);
    Object.entries(randomElement.attributes).forEach(([key, value]) => {
      mockEl.setAttribute(key, value);
    });
    if (randomElement.text) {
      mockEl.textContent = randomElement.text;
    }

    const cssSelector = generateCSSSelector(mockEl);
    const xpath = generateXPath(mockEl);
    
    const locatorData: LocatorData = {
      id: Date.now().toString(),
      element: `<${randomElement.tag}${Object.entries(randomElement.attributes)
        .map(([k, v]) => ` ${k}="${v}"`).join('')}>${randomElement.text}</${randomElement.tag}>`,
      cssSelector,
      xpath,
      framework: generateFrameworkLocator(cssSelector, xpath),
      timestamp: new Date()
    };

    setSelectedElement(locatorData);
    setLocatorHistory(prev => [locatorData, ...prev.slice(0, 19)]);
    
    if (onLocatorGenerated) {
      onLocatorGenerated(locatorData);
    }

    toast({
      title: "Element Inspected",
      description: `Generated locators for ${randomElement.tag} element`
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${type} copied to clipboard`
    });
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(locatorHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'locator-history.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported",
      description: "Locator history exported as JSON"
    });
  };

  const clearHistory = () => {
    setLocatorHistory([]);
    setSelectedElement(null);
    toast({
      title: "Cleared",
      description: "Locator history cleared"
    });
  };

  return (
    <div className="space-y-6">
      {/* URL Input and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Locator Inspector
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Enter URL to inspect (e.g., https://example.com)"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button onClick={handleUrlLoad}>Load</Button>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={selectedFramework} onValueChange={setSelectedFramework}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="playwright">Playwright</SelectItem>
                <SelectItem value="selenium">Selenium</SelectItem>
                <SelectItem value="cypress">Cypress</SelectItem>
                <SelectItem value="webdriverio">WebdriverIO</SelectItem>
                <SelectItem value="testcafe">TestCafe</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={() => setIsInspecting(!isInspecting)}
              variant={isInspecting ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isInspecting ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isInspecting ? 'Stop Inspecting' : 'Start Inspecting'}
            </Button>
            
            {/* Mock inspection button for demo */}
            <Button 
              onClick={simulateElementInspection}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              Demo Inspect
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Window */}
      <Card>
        <CardHeader>
          <CardTitle>Page Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden bg-muted/50">
            {currentUrl ? (
              <iframe
                ref={iframeRef}
                src={currentUrl}
                className="w-full h-96 border-0"
                title="Page Inspector"
                sandbox="allow-same-origin allow-scripts"
              />
            ) : (
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                Enter a URL above to start inspecting elements
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Locator Results and History */}
      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Current Element</TabsTrigger>
          <TabsTrigger value="history">History ({locatorHistory.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current">
          {selectedElement ? (
            <Card>
              <CardHeader>
                <CardTitle>Generated Locators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-2">Element:</div>
                  <code className="text-xs break-all">{selectedElement.element}</code>
                </div>
                
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">CSS Selector</Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(selectedElement.cssSelector, 'CSS Selector')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={selectedElement.cssSelector}
                      readOnly
                      className="font-mono text-sm"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">XPath</Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(selectedElement.xpath, 'XPath')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={selectedElement.xpath}
                      readOnly
                      className="font-mono text-sm"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{selectedFramework} Code</Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(selectedElement.framework, `${selectedFramework} code`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={selectedElement.framework}
                      readOnly
                      className="font-mono text-sm"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  No element selected. Click "Demo Inspect" or start inspecting elements on a loaded page.
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Locator History
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={exportHistory}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm" variant="outline" onClick={clearHistory}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {locatorHistory.length > 0 ? (
                  <div className="space-y-4">
                    {locatorHistory.map((locator) => (
                      <div key={locator.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {locator.element.substring(0, 50)}...
                          </code>
                          <div className="text-xs text-muted-foreground">
                            {locator.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div 
                            className="cursor-pointer hover:bg-muted p-2 rounded"
                            onClick={() => copyToClipboard(locator.cssSelector, 'CSS Selector')}
                          >
                            <div className="font-medium">CSS:</div>
                            <code className="text-xs break-all">{locator.cssSelector}</code>
                          </div>
                          <div 
                            className="cursor-pointer hover:bg-muted p-2 rounded"
                            onClick={() => copyToClipboard(locator.xpath, 'XPath')}
                          >
                            <div className="font-medium">XPath:</div>
                            <code className="text-xs break-all">{locator.xpath}</code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No locators in history yet
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};