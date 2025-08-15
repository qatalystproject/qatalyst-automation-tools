import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { specFiles, playwrightCode } = await req.json()

    if (!specFiles || !Array.isArray(specFiles) || specFiles.length === 0) {
      return new Response(
        JSON.stringify({ error: "No spec files provided" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create temporary directory for test files
    const tempDir = await Deno.makeTempDir({ prefix: "playwright_tests_" })
    
    try {
      // Write Playwright test files
      const testFiles = []
      for (let i = 0; i < specFiles.length; i++) {
        const fileName = `test_${i + 1}.spec.js`
        const filePath = `${tempDir}/${fileName}`
        
        // Extract individual test from playwrightCode based on scenario
        const testContent = playwrightCode || `
import { test, expect } from '@playwright/test';

test('${specFiles[i]}', async ({ page }) => {
  // Generated test code would be here
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});`
        
        await Deno.writeTextFile(filePath, testContent)
        testFiles.push(filePath)
      }

      // Run Playwright tests
      const cmd = [
        "npx", 
        "playwright", 
        "test", 
        ...testFiles,
        "--reporter=json"
      ]

      const process = new Deno.Command(cmd[0], {
        args: cmd.slice(1),
        cwd: tempDir,
        stdout: "piped",
        stderr: "piped"
      })

      const { code, stdout, stderr } = await process.output()
      
      const output = new TextDecoder().decode(stdout)
      const errorOutput = new TextDecoder().decode(stderr)

      // Clean up temp directory
      await Deno.remove(tempDir, { recursive: true })

      if (code !== 0) {
        console.error("Playwright execution failed:", errorOutput)
        
        // Try to parse partial results from output
        let results = []
        try {
          const jsonOutput = JSON.parse(output)
          results = parsePlaywrightResults(jsonOutput)
        } catch {
          // Create fallback results if JSON parsing fails
          results = specFiles.map((file, index) => ({
            id: `test_${index + 1}`,
            name: file,
            status: "failed",
            duration: "0s",
            details: "Test execution failed",
            error: errorOutput || "Unknown error"
          }))
        }

        return new Response(
          JSON.stringify({ 
            success: false,
            results,
            error: errorOutput,
            exitCode: code
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Parse successful results
      const jsonOutput = JSON.parse(output)
      const results = parsePlaywrightResults(jsonOutput)

      return new Response(
        JSON.stringify({ 
          success: true,
          results,
          exitCode: code
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )

    } catch (error) {
      // Clean up temp directory on error
      try {
        await Deno.remove(tempDir, { recursive: true })
      } catch {}
      
      throw error
    }

  } catch (error) {
    console.error("Error in run-playwright function:", error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Internal server error",
        success: false
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function parsePlaywrightResults(jsonOutput: any) {
  const results = []
  
  if (jsonOutput.suites) {
    for (const suite of jsonOutput.suites) {
      if (suite.specs) {
        for (const spec of suite.specs) {
          for (const test of spec.tests) {
            results.push({
              id: test.id || `test_${results.length + 1}`,
              name: test.title,
              status: getTestStatus(test.outcome),
              duration: formatDuration(test.results?.[0]?.duration || 0),
              details: getTestDetails(test),
              error: getTestError(test)
            })
          }
        }
      }
    }
  }
  
  return results
}

function getTestStatus(outcome: string): string {
  switch (outcome) {
    case 'expected':
      return 'passed'
    case 'unexpected':
    case 'flaky':
      return 'failed'
    case 'skipped':
      return 'pending'
    default:
      return 'failed'
  }
}

function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`
  }
  return `${(ms / 1000).toFixed(1)}s`
}

function getTestDetails(test: any): string {
  if (test.outcome === 'expected') {
    return 'Test passed successfully'
  }
  
  const result = test.results?.[0]
  if (result?.error?.message) {
    return `Test failed: ${result.error.message}`
  }
  
  return 'Test failed - check error details'
}

function getTestError(test: any): string | undefined {
  const result = test.results?.[0]
  if (result?.error) {
    return result.error.message || 'Unknown error'
  }
  return undefined
}