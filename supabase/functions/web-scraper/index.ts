import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface ScraperStep {
  action: 'navigate' | 'click' | 'fill' | 'assert' | 'select' | 'check';
  target?: string;
  locator: string;
  value?: string;
  expected?: string;
}

interface ScraperFlow {
  title: string;
  steps: ScraperStep[];
}

interface ScraperElement {
  type: 'button' | 'input' | 'link' | 'dropdown' | 'checkbox' | 'radio' | 'textarea';
  name: string;
  locator: string;
  attributes?: Record<string, string>;
}

interface ScraperResult {
  url: string;
  flows: ScraperFlow[];
  elements: ScraperElement[];
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url, maxDepth = 1, includeHiddenElements = false } = await req.json()

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Since we can't run actual browser automation in Deno Deploy,
    // we'll use a simulated analysis approach
    const result = await analyzeWebsite(url, maxDepth, includeHiddenElements)

    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Scraper error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function analyzeWebsite(url: string, maxDepth: number, includeHiddenElements: boolean): Promise<ScraperResult> {
  try {
    // Fetch the HTML content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`)
    }

    const html = await response.text()
    
    // Extract elements and flows from HTML
    const elements = extractElements(html)
    const flows = generateFlows(elements, url)

    return {
      url,
      flows,
      elements
    }
  } catch (error) {
    return {
      url,
      flows: [],
      elements: [],
      error: error.message
    }
  }
}

function extractElements(html: string): ScraperElement[] {
  const elements: ScraperElement[] = []
  
  // Simple regex-based extraction (in production, use a proper HTML parser)
  const patterns = [
    // Buttons
    { 
      regex: /<button[^>]*>(.*?)<\/button>/gi,
      type: 'button' as const,
      getLocator: (match: string, text: string) => {
        const id = match.match(/id=["']([^"']*)["']/)?.[1]
        const className = match.match(/class=["']([^"']*)["']/)?.[1]
        if (text.trim()) return `button:has-text("${text.trim()}")`
        if (id) return `button#${id}`
        if (className) return `button.${className.split(' ')[0]}`
        return 'button'
      }
    },
    // Input elements
    {
      regex: /<input[^>]*>/gi,
      type: 'input' as const,
      getLocator: (match: string) => {
        const type = match.match(/type=["']([^"']*)["']/)?.[1] || 'text'
        const placeholder = match.match(/placeholder=["']([^"']*)["']/)?.[1]
        const name = match.match(/name=["']([^"']*)["']/)?.[1]
        const id = match.match(/id=["']([^"']*)["']/)?.[1]
        
        if (placeholder) return `input[placeholder="${placeholder}"]`
        if (name) return `input[name="${name}"]`
        if (id) return `input#${id}`
        return `input[type="${type}"]`
      }
    },
    // Links
    {
      regex: /<a[^>]*>(.*?)<\/a>/gi,
      type: 'link' as const,
      getLocator: (match: string, text: string) => {
        const href = match.match(/href=["']([^"']*)["']/)?.[1]
        if (text.trim()) return `a:has-text("${text.trim()}")`
        if (href) return `a[href="${href}"]`
        return 'a'
      }
    },
    // Select elements
    {
      regex: /<select[^>]*>(.*?)<\/select>/gi,
      type: 'dropdown' as const,
      getLocator: (match: string) => {
        const name = match.match(/name=["']([^"']*)["']/)?.[1]
        const id = match.match(/id=["']([^"']*)["']/)?.[1]
        if (name) return `select[name="${name}"]`
        if (id) return `select#${id}`
        return 'select'
      }
    },
    // Textareas
    {
      regex: /<textarea[^>]*>(.*?)<\/textarea>/gi,
      type: 'textarea' as const,
      getLocator: (match: string) => {
        const name = match.match(/name=["']([^"']*)["']/)?.[1]
        const id = match.match(/id=["']([^"']*)["']/)?.[1]
        const placeholder = match.match(/placeholder=["']([^"']*)["']/)?.[1]
        if (placeholder) return `textarea[placeholder="${placeholder}"]`
        if (name) return `textarea[name="${name}"]`
        if (id) return `textarea#${id}`
        return 'textarea'
      }
    }
  ]

  patterns.forEach(pattern => {
    let match
    while ((match = pattern.regex.exec(html)) !== null) {
      const fullMatch = match[0]
      const textContent = match[1] || ''
      const name = textContent.trim() || extractNameFromElement(fullMatch)
      
      elements.push({
        type: pattern.type,
        name: name || `${pattern.type}_${elements.length + 1}`,
        locator: pattern.getLocator(fullMatch, textContent)
      })
    }
  })

  return elements
}

function extractNameFromElement(elementHtml: string): string {
  const placeholder = elementHtml.match(/placeholder=["']([^"']*)["']/)?.[1]
  const ariaLabel = elementHtml.match(/aria-label=["']([^"']*)["']/)?.[1]
  const name = elementHtml.match(/name=["']([^"']*)["']/)?.[1]
  const id = elementHtml.match(/id=["']([^"']*)["']/)?.[1]
  
  return placeholder || ariaLabel || name || id || ''
}

function generateFlows(elements: ScraperElement[], url: string): ScraperFlow[] {
  const flows: ScraperFlow[] = []
  
  // Look for login flow
  const loginElements = elements.filter(el => 
    el.name.toLowerCase().includes('login') ||
    el.name.toLowerCase().includes('username') ||
    el.name.toLowerCase().includes('email') ||
    el.name.toLowerCase().includes('password')
  )
  
  if (loginElements.length >= 2) {
    const usernameField = loginElements.find(el => 
      el.name.toLowerCase().includes('username') || 
      el.name.toLowerCase().includes('email')
    )
    const passwordField = loginElements.find(el => 
      el.name.toLowerCase().includes('password')
    )
    const loginButton = elements.find(el => 
      el.type === 'button' && 
      (el.name.toLowerCase().includes('login') || el.name.toLowerCase().includes('sign in'))
    )

    if (usernameField && passwordField) {
      flows.push({
        title: 'User Login Flow',
        steps: [
          { action: 'navigate', locator: url, target: url },
          { action: 'fill', locator: usernameField.locator, value: 'test@example.com' },
          { action: 'fill', locator: passwordField.locator, value: 'password123' },
          ...(loginButton ? [{ action: 'click' as const, locator: loginButton.locator }] : []),
          { action: 'assert', locator: 'body', expected: 'dashboard|welcome|home' }
        ]
      })
    }
  }

  // Look for form submission flows
  const forms = elements.filter(el => el.type === 'input' || el.type === 'textarea')
  const submitButtons = elements.filter(el => 
    el.type === 'button' && 
    (el.name.toLowerCase().includes('submit') || 
     el.name.toLowerCase().includes('send') ||
     el.name.toLowerCase().includes('save'))
  )

  if (forms.length > 0 && submitButtons.length > 0) {
    flows.push({
      title: 'Form Submission Flow',
      steps: [
        { action: 'navigate', locator: url, target: url },
        ...forms.slice(0, 3).map(form => ({
          action: 'fill' as const,
          locator: form.locator,
          value: form.name.toLowerCase().includes('email') ? 'test@example.com' : 'Test Value'
        })),
        { action: 'click', locator: submitButtons[0].locator },
        { action: 'assert', locator: 'body', expected: 'success|thank|confirm' }
      ]
    })
  }

  // Navigation flow
  const navigationLinks = elements.filter(el => 
    el.type === 'link' && 
    !el.name.toLowerCase().includes('javascript') &&
    !el.locator.includes('#')
  ).slice(0, 3)

  if (navigationLinks.length > 0) {
    flows.push({
      title: 'Navigation Flow',
      steps: [
        { action: 'navigate', locator: url, target: url },
        ...navigationLinks.map(link => ({
          action: 'click' as const,
          locator: link.locator
        }))
      ]
    })
  }

  return flows
}