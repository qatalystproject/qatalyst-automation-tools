export interface ScraperStep {
  action: 'navigate' | 'click' | 'fill' | 'assert' | 'select' | 'check';
  target?: string;
  locator: string;
  value?: string;
  expected?: string;
}

export interface ScraperFlow {
  title: string;
  steps: ScraperStep[];
}

export interface ScraperElement {
  type: 'button' | 'input' | 'link' | 'dropdown' | 'checkbox' | 'radio' | 'textarea';
  name: string;
  locator: string;
  attributes?: Record<string, string>;
}

export interface ScraperResult {
  url: string;
  flows: ScraperFlow[];
  elements: ScraperElement[];
  error?: string;
}

export interface ScraperRequest {
  url: string;
  maxDepth?: number;
  includeHiddenElements?: boolean;
}