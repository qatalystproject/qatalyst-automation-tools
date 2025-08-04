export interface TestCase {
  id: string;
  name: string;
  status: "active" | "archived";
  type: "gherkin" | "playwright";
  lastModified: string;
  description: string;
  content?: string;
}

export interface TestCaseManagerProps {
  testCases: TestCase[];
  onTestCasesChange: (testCases: TestCase[]) => void;
  onNavigateToGenerator: () => void;
}