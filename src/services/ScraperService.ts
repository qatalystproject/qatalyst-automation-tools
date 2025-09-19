import { supabase } from '@/integrations/supabase/client';
import type { ScraperResult, ScraperRequest } from '@/types/scraper';

export class ScraperService {
  static async analyzeWebsite(request: ScraperRequest): Promise<ScraperResult> {
    try {
      const { data, error } = await supabase.functions.invoke('web-scraper', {
        body: request,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data as ScraperResult;
    } catch (error) {
      console.error('Error analyzing website:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to analyze website');
    }
  }

  static generateGherkinFromFlows(scraperResult: ScraperResult): string {
    if (!scraperResult.flows.length) {
      return `Feature: Website Testing for ${scraperResult.url}\n\nNo flows detected for this website.`;
    }

    let gherkin = `Feature: Website Testing for ${scraperResult.url}\n\n`;

    scraperResult.flows.forEach((flow, index) => {
      gherkin += `  Scenario: ${flow.title}\n`;
      
      flow.steps.forEach(step => {
        switch (step.action) {
          case 'navigate':
            gherkin += `    Given the user navigates to "${step.target || step.locator}"\n`;
            break;
          case 'fill':
            gherkin += `    When the user fills "${step.locator}" with "${step.value}"\n`;
            break;
          case 'click':
            gherkin += `    And the user clicks "${step.locator}"\n`;
            break;
          case 'select':
            gherkin += `    And the user selects "${step.value}" from "${step.locator}"\n`;
            break;
          case 'check':
            gherkin += `    And the user checks "${step.locator}"\n`;
            break;
          case 'assert':
            gherkin += `    Then the user should see "${step.expected}" in "${step.locator}"\n`;
            break;
        }
      });
      
      if (index < scraperResult.flows.length - 1) {
        gherkin += '\n';
      }
    });

    return gherkin;
  }

  static generatePlaywrightFromFlows(scraperResult: ScraperResult): string {
    if (!scraperResult.flows.length) {
      return `// No flows detected for ${scraperResult.url}`;
    }

    let playwright = `import { test, expect } from '@playwright/test';\n\n`;

    scraperResult.flows.forEach(flow => {
      playwright += `test('${flow.title}', async ({ page }) => {\n`;
      
      flow.steps.forEach(step => {
        switch (step.action) {
          case 'navigate':
            playwright += `  await page.goto('${step.target || step.locator}');\n`;
            break;
          case 'fill':
            playwright += `  await page.fill('${step.locator}', '${step.value}');\n`;
            break;
          case 'click':
            playwright += `  await page.click('${step.locator}');\n`;
            break;
          case 'select':
            playwright += `  await page.selectOption('${step.locator}', '${step.value}');\n`;
            break;
          case 'check':
            playwright += `  await page.check('${step.locator}');\n`;
            break;
          case 'assert':
            if (step.expected?.includes('|')) {
              const options = step.expected.split('|');
              playwright += `  await expect(page.locator('${step.locator}')).toContainText(/${options.join('|')}/i);\n`;
            } else {
              playwright += `  await expect(page.locator('${step.locator}')).toContainText('${step.expected}');\n`;
            }
            break;
        }
      });
      
      playwright += `});\n\n`;
    });

    return playwright;
  }
}