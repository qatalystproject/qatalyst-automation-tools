
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
    <Card className="w-full max-w-md bg-midnight-navy border-bright-cyan/30 hover:border-bright-cyan/50 hover:glow-cyan transition-all duration-300">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full gradient-accent flex items-center justify-center glow-emerald">
          <Key className="h-6 w-6 text-background" />
        </div>
        <CardTitle className="text-primary-text">OpenAI Authentication</CardTitle>
        <CardDescription className="text-secondary-text">
          Enter your OpenAI API key to start generating test automation scripts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-primary-text">API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? "text" : "password"}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-dark-slate border-bright-cyan/30 text-primary-text pr-10 focus:border-bright-cyan focus:glow-cyan transition-all duration-200"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto text-secondary-text hover:text-bright-cyan"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <Button 
            type="submit" 
            variant="gradient"
            className="w-full"
            disabled={!apiKey.trim()}
          >
            Connect API
          </Button>
        </form>
        <div className="mt-4 text-xs text-muted-text text-center">
          Your API key is stored locally and never sent to our servers
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthenticationCard;
