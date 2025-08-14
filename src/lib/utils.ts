import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Smart Locator Generation utilities based on QA best practices
export class SmartLocatorGenerator {
  static generateOptimalSelector(element: Element): { css: string; xpath: string; quality: string } {
    const elementType = this.getElementType(element);
    let selectors: string[] = [];

    // Generate selectors based on element type priority
    if (elementType === 'input') {
      selectors = this.generateInputSelectors(element);
    } else if (elementType === 'button') {
      selectors = this.generateButtonSelectors(element);
    } else if (elementType === 'link') {
      selectors = this.generateLinkSelectors(element);
    } else if (elementType === 'select') {
      selectors = this.generateSelectSelectors(element);
    } else {
      selectors = this.generateGenericSelectors(element);
    }

    // Find the best unique selector
    const bestSelector = this.findBestUniqueSelector(selectors);
    const xpath = this.generateXPath(element);
    const quality = this.getLocatorQuality(bestSelector, elementType);

    return {
      css: bestSelector,
      xpath,
      quality
    };
  }

  private static getElementType(element: Element): string {
    const tagName = element.tagName.toLowerCase();

    if (tagName === 'input' || tagName === 'textarea') {
      return 'input';
    } else if (tagName === 'button' || (tagName === 'input' && (element as HTMLInputElement).type === 'button') ||
               (tagName === 'input' && (element as HTMLInputElement).type === 'submit')) {
      return 'button';
    } else if (tagName === 'a') {
      return 'link';
    } else if (tagName === 'select') {
      return 'select';
    }
    return 'generic';
  }

  private static generateInputSelectors(element: Element): string[] {
    const selectors: string[] = [];
    const input = element as HTMLInputElement;

    // 1. Placeholder Text (highest priority for inputs)
    if (input.placeholder?.trim()) {
      selectors.push(`[placeholder="${this.escapeSelector(input.placeholder)}"]`);
    }

    // 2. ID Attribute
    if (input.id) {
      selectors.push(`#${this.escapeSelector(input.id)}`);
    }

    // 3. Name Attribute
    if (input.name) {
      selectors.push(`[name="${this.escapeSelector(input.name)}"]`);
    }

    // 4. Data-testid attributes
    const testId = input.getAttribute('data-testid') || input.getAttribute('data-test');
    if (testId) {
      selectors.push(`[data-testid="${this.escapeSelector(testId)}"]`);
    }

    // 5. Type + unique class combinations
    if (input.type) {
      selectors.push(`input[type="${this.escapeSelector(input.type)}"]`);
      
      const uniqueClass = this.getUniqueClass(input);
      if (uniqueClass) {
        selectors.push(`input[type="${this.escapeSelector(input.type)}"].${this.escapeSelector(uniqueClass)}`);
      }
    }

    // 6. Aria-label
    const ariaLabel = input.getAttribute('aria-label');
    if (ariaLabel) {
      selectors.push(`[aria-label="${this.escapeSelector(ariaLabel)}"]`);
    }

    return selectors;
  }

  private static generateButtonSelectors(element: Element): string[] {
    const selectors: string[] = [];
    const button = element as HTMLButtonElement;

    // 1. ID Attribute (highest priority for buttons)
    if (button.id) {
      selectors.push(`#${this.escapeSelector(button.id)}`);
    }

    // 2. Data-testid attributes
    const testId = button.getAttribute('data-testid') || button.getAttribute('data-test');
    if (testId) {
      selectors.push(`[data-testid="${this.escapeSelector(testId)}"]`);
    }

    // 3. Name Attribute
    if (button.name) {
      selectors.push(`[name="${this.escapeSelector(button.name)}"]`);
    }

    // 4. Type Attribute
    if (button.type) {
      selectors.push(`button[type="${this.escapeSelector(button.type)}"]`);
    }

    // 5. Unique Class
    const uniqueClass = this.getUniqueClass(button);
    if (uniqueClass) {
      selectors.push(`.${this.escapeSelector(uniqueClass)}`);
    }

    // 6. Text content for buttons
    const textContent = button.textContent?.trim();
    if (textContent && textContent.length > 0) {
      // Add as attribute selector that can be used with text matching
      selectors.push(`button:has-text("${this.escapeSelector(textContent)}")`);
    }

    return selectors;
  }

  private static generateLinkSelectors(element: Element): string[] {
    const selectors: string[] = [];
    const link = element as HTMLAnchorElement;

    // 1. ID Attribute
    if (link.id) {
      selectors.push(`#${this.escapeSelector(link.id)}`);
    }

    // 2. Href Attribute
    if (link.href && !link.href.startsWith('javascript:')) {
      const href = link.getAttribute('href');
      if (href) {
        selectors.push(`[href="${this.escapeSelector(href)}"]`);
      }
    }

    // 3. Data-testid
    const testId = link.getAttribute('data-testid') || link.getAttribute('data-test');
    if (testId) {
      selectors.push(`[data-testid="${this.escapeSelector(testId)}"]`);
    }

    // 4. Unique Class
    const uniqueClass = this.getUniqueClass(link);
    if (uniqueClass) {
      selectors.push(`.${this.escapeSelector(uniqueClass)}`);
    }

    return selectors;
  }

  private static generateSelectSelectors(element: Element): string[] {
    const selectors: string[] = [];
    const select = element as HTMLSelectElement;

    // 1. ID Attribute
    if (select.id) {
      selectors.push(`#${this.escapeSelector(select.id)}`);
    }

    // 2. Name Attribute
    if (select.name) {
      selectors.push(`[name="${this.escapeSelector(select.name)}"]`);
    }

    // 3. Data-testid
    const testId = select.getAttribute('data-testid') || select.getAttribute('data-test');
    if (testId) {
      selectors.push(`[data-testid="${this.escapeSelector(testId)}"]`);
    }

    // 4. Unique Class
    const uniqueClass = this.getUniqueClass(select);
    if (uniqueClass) {
      selectors.push(`.${this.escapeSelector(uniqueClass)}`);
    }

    return selectors;
  }

  private static generateGenericSelectors(element: Element): string[] {
    const selectors: string[] = [];

    // 1. ID Attribute
    if (element.id) {
      selectors.push(`#${this.escapeSelector(element.id)}`);
    }

    // 2. Data-testid
    const testId = element.getAttribute('data-testid') || element.getAttribute('data-test');
    if (testId) {
      selectors.push(`[data-testid="${this.escapeSelector(testId)}"]`);
    }

    // 3. Unique Class
    const uniqueClass = this.getUniqueClass(element);
    if (uniqueClass) {
      selectors.push(`.${this.escapeSelector(uniqueClass)}`);
    }

    // 4. Role attribute
    const role = element.getAttribute('role');
    if (role) {
      selectors.push(`[role="${this.escapeSelector(role)}"]`);
    }

    // 5. Fallback with tag name
    selectors.push(element.tagName.toLowerCase());

    return selectors;
  }

  private static findBestUniqueSelector(selectors: string[]): string {
    // Return the first selector that exists, prioritized by quality
    for (const selector of selectors) {
      if (selector && selector.trim()) {
        return selector;
      }
    }
    return selectors[0] || 'element';
  }

  private static getUniqueClass(element: Element): string | null {
    const classes = Array.from(element.classList);
    
    // Look for semantic or unique classes
    const semanticKeywords = [
      'submit', 'cancel', 'primary', 'secondary', 'login', 'register',
      'search', 'filter', 'sort', 'edit', 'delete', 'save', 'close'
    ];

    for (const cls of classes) {
      const lowerCls = cls.toLowerCase();
      if (semanticKeywords.some(keyword => lowerCls.includes(keyword))) {
        return cls;
      }
    }

    // Return first class if no semantic class found
    return classes.length > 0 ? classes[0] : null;
  }

  private static generateXPath(element: Element): string {
    // Generate XPath with priority on attributes
    const tagName = element.tagName.toLowerCase();

    // Try ID first
    if (element.id) {
      return `//${tagName}[@id="${element.id}"]`;
    }

    // Try data-testid
    const testId = element.getAttribute('data-testid') || element.getAttribute('data-test');
    if (testId) {
      return `//${tagName}[@data-testid="${testId}"]`;
    }

    // Try name attribute
    const name = element.getAttribute('name');
    if (name) {
      return `//${tagName}[@name="${name}"]`;
    }

    // Try placeholder for inputs
    if (tagName === 'input') {
      const placeholder = (element as HTMLInputElement).placeholder;
      if (placeholder) {
        return `//input[@placeholder="${placeholder}"]`;
      }
    }

    // Try text content for buttons and links
    if (tagName === 'button' || tagName === 'a') {
      const text = element.textContent?.trim();
      if (text) {
        return `//${tagName}[text()="${text}"]`;
      }
    }

    // Fallback to position-based
    const parent = element.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(child => 
        child.tagName === element.tagName
      );
      const index = siblings.indexOf(element) + 1;
      return `//${tagName}[${index}]`;
    }

    return `//${tagName}`;
  }

  private static getLocatorQuality(selector: string, elementType: string): string {
    if (selector.startsWith('#')) return 'Excellent (ID)';
    if (selector.includes('[data-testid=')) return 'Excellent (Test ID)';
    if (selector.includes('[placeholder=')) return 'Excellent (Placeholder)';
    if (selector.includes('[name=')) return 'Good (Name)';
    if (selector.includes('[aria-label=')) return 'Good (Aria Label)';
    if (selector.includes('[role=')) return 'Good (Role)';
    if (selector.startsWith('.') && !selector.includes(' ')) return 'Good (Unique Class)';
    if (selector.includes('[type=')) return 'Fair (Type Attribute)';
    if (selector.includes(':has-text')) return 'Good (Text Content)';
    if (selector.includes('[href=')) return 'Good (Href)';
    return 'Fair (Generic)';
  }

  private static escapeSelector(value: string): string {
    // Basic CSS selector escaping
    return value.replace(/["'\\]/g, '\\$&');
  }

  // Generate framework-specific code
  static generateFrameworkCode(selector: string, xpath: string, framework: string): string {
    const frameworks: Record<string, (css: string, xpath: string) => string> = {
      playwright: (css, xpath) => `
// Playwright locators
await page.locator('${css}').click();
// or using XPath
await page.locator('xpath=${xpath}').click();`,

      selenium: (css, xpath) => `
// Selenium WebDriver (Java)
driver.findElement(By.cssSelector("${css}")).click();
// or using XPath
driver.findElement(By.xpath("${xpath}")).click();`,

      cypress: (css, xpath) => `
// Cypress
cy.get('${css}').click();
// Note: Cypress doesn't support XPath natively`,

      webdriverio: (css, xpath) => `
// WebdriverIO
await $('${css}').click();
// or using XPath
await $('${xpath}').click();`,

      testcafe: (css, xpath) => `
// TestCafe
await t.click(Selector('${css}'));
// Note: TestCafe uses CSS selectors primarily`
    };

    return frameworks[framework]?.(selector, xpath) || `// Framework "${framework}" not supported`;
  }
}
