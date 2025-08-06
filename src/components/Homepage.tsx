import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Play, Settings, GitBranch, Zap, Brain, Target, Shield, ArrowRight, CheckCircle } from "lucide-react";

interface HomepageProps {
  onGetStarted: () => void;
}

const Homepage = ({ onGetStarted }: HomepageProps) => {
  const features = [
    {
      icon: <Brain className="h-6 w-6 text-blue-400" />,
      title: "AI-Powered Test Generation",
      description: "Transform requirements into comprehensive Gherkin scenarios using advanced AI. Generate test cases automatically from user stories, specifications, or existing documentation.",
      benefits: ["Natural language processing", "Context-aware generation", "Industry best practices"]
    },
    {
      icon: <Play className="h-6 w-6 text-green-400" />,
      title: "Playwright Code Generation",
      description: "Convert Gherkin scenarios into executable Playwright automation code instantly. Support for multiple browsers and testing patterns with optimized selectors.",
      benefits: ["Cross-browser testing", "Modern web technologies", "Robust selectors"]
    },
    {
      icon: <Settings className="h-6 w-6 text-purple-400" />,
      title: "Test Case Management",
      description: "Organize, edit, and manage your test scenarios efficiently. Track test status, maintain test suites, and collaborate with your team seamlessly.",
      benefits: ["Centralized management", "Version control", "Team collaboration"]
    },
    {
      icon: <Target className="h-6 w-6 text-orange-400" />,
      title: "Smart Execution Engine",
      description: "Execute tests with intelligent scheduling and reporting. Get detailed insights, failure analysis, and performance metrics for continuous improvement.",
      benefits: ["Parallel execution", "Detailed reporting", "Failure analysis"]
    },
    {
      icon: <GitBranch className="h-6 w-6 text-cyan-400" />,
      title: "Export & Integration",
      description: "Export test cases, code, and reports in multiple formats. Integrate with CI/CD pipelines and popular testing frameworks seamlessly.",
      benefits: ["Multiple export formats", "CI/CD integration", "Framework compatibility"]
    },
    {
      icon: <Shield className="h-6 w-6 text-red-400" />,
      title: "Quality Assurance",
      description: "Ensure test quality with built-in validation, best practice recommendations, and automated quality checks throughout the testing lifecycle.",
      benefits: ["Quality validation", "Best practices", "Automated checks"]
    }
  ];

  const stats = [
    { value: "95.7%", label: "Test Coverage", description: "Average coverage achieved" },
    { value: "82.3%", label: "Time Saved", description: "Reduction in test creation time" },
    { value: "99.9%", label: "Reliability", description: "Platform uptime guarantee" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 rounded-xl overflow-hidden mr-4">
              <img 
                src="/lovable-uploads/cbcade91-def1-4f98-8c03-f4b432f827b7.png" 
                alt="QAtalyst Logo" 
                className="h-full w-full object-contain"
              />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              QAtalyst
            </h1>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            AI-Powered Test Automation Platform
          </h2>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your testing workflow with intelligent automation. Generate test cases, 
            create Playwright code, and execute comprehensive test suites powered by artificial intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-3 text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 text-lg"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">{stat.value}</div>
                <div className="text-white font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-slate-400">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Powerful Features</h3>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Everything you need to automate your testing process from start to finish
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-slate-700 rounded-lg">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm text-slate-300">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Workflow Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Simple Workflow</h3>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Get started with QAtalyst in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Generate", description: "Create test scenarios using AI", icon: <FileText className="h-8 w-8" /> },
              { step: "2", title: "Convert", description: "Transform to Playwright code", icon: <Play className="h-8 w-8" /> },
              { step: "3", title: "Manage", description: "Organize your test cases", icon: <Settings className="h-8 w-8" /> },
              { step: "4", title: "Execute", description: "Run and analyze results", icon: <Zap className="h-8 w-8" /> }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {item.step}
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-500/30">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold text-black mb-4">
              Ready to Transform Your Testing?
            </h3>
            <p className="text-lg text-black mb-8 max-w-2xl mx-auto">
              Join thousands of QA professionals who have revolutionized their testing process with QAtalyst.
            </p>
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-12 py-4 text-lg"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Homepage;