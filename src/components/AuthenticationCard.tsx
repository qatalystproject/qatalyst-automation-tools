
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Eye, EyeOff } from "lucide-react";

interface AuthenticationCardProps {
  onAuthenticate: (key: string) => void;
}

const AuthenticationCard = ({ onAuthenticate }: AuthenticationCardProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onAuthenticate(apiKey.trim());
    }
  };

  return (
    <Card className="w-full max-w-md bg-slate-800 border-slate-700">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
          <Key className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-white">OpenAI Authentication</CardTitle>
        <CardDescription className="text-slate-400">
          Enter your OpenAI API key to start generating test automation scripts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-white">API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? "text" : "password"}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4 text-slate-400" />
                ) : (
                  <Eye className="h-4 w-4 text-slate-400" />
                )}
              </Button>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            disabled={!apiKey.trim()}
          >
            Connect API
          </Button>
        </form>
        <div className="mt-4 text-xs text-slate-500 text-center">
          Your API key is stored locally and never sent to our servers
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthenticationCard;
