
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CsvUploaderProps {
  apiKey: string;
}

const CsvUploader = ({ apiKey }: CsvUploaderProps) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [generatedTests, setGeneratedTests] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      
      // Parse CSV
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => row.split(','));
        setCsvData(rows);
      };
      reader.readAsText(file);
      
      toast({
        title: "CSV Uploaded",
        description: `File "${file.name}" has been uploaded successfully.`,
      });
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a valid CSV file.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const generateFromCsv = async () => {
    if (!csvData.length) return;
    
    setIsProcessing(true);
    try {
      // Simulate CSV processing and Gherkin generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockGeneratedTests = csvData.map((row, index) => {
        if (index === 0) return ""; // Skip header
        return `Feature: Test Case ${index}
  Scenario: Testing ${row[0] || 'functionality'}
    Given I have the test data: ${row.join(', ')}
    When I execute the test steps
    Then I should verify the expected results`;
      }).filter(test => test).join('\n\n');

      setGeneratedTests(mockGeneratedTests);
      toast({
        title: "Tests Generated",
        description: `Successfully generated ${csvData.length - 1} test scenarios from CSV data.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate tests from CSV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setCsvFile(null);
    setCsvData([]);
    setGeneratedTests("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Upload className="h-5 w-5 mr-2 text-blue-400" />
            CSV Data Import
          </CardTitle>
          <CardDescription className="text-slate-400">
            Upload CSV files to generate bulk test scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
            {!csvFile ? (
              <div>
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <span className="text-blue-400 hover:text-blue-300">Click to upload</span>
                  <span className="text-slate-400"> or drag and drop your CSV file</span>
                </label>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between bg-slate-700 p-3 rounded">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-400" />
                  <span className="text-white">{csvFile.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {csvData.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-medium">Preview ({csvData.length} rows)</h4>
              <div className="bg-slate-900 rounded p-3 max-h-32 overflow-auto">
                <table className="text-xs text-slate-300 w-full">
                  <tbody>
                    {csvData.slice(0, 5).map((row, index) => (
                      <tr key={index}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="pr-2 py-1 border-r border-slate-700">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Button 
            onClick={generateFromCsv}
            disabled={!csvData.length || isProcessing}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {isProcessing ? "Processing CSV..." : "Generate Test Cases"}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Generated Test Cases</CardTitle>
          <CardDescription className="text-slate-400">
            Bulk generated test scenarios from CSV data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={generatedTests}
            readOnly
            placeholder="Generated test cases will appear here after CSV processing..."
            className="w-full h-96 bg-slate-900 border border-slate-600 rounded p-3 text-green-400 font-mono text-sm resize-none"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CsvUploader;
