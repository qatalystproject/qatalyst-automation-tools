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
            <div className="h-24 w-24 rounded-xl overflow-hidden mr-6">
              <img
                src="/lovable-uploads/269d3e8a-a51d-4e23-9146-715eea456ae5.png" 
                alt="QAtalyst Logo" 
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                QAtalyst
              </h1>
              <p className="text-lg text-cyan-300 font-medium mt-2">
                Test Smarter. Ship Faster
              </p>
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-blue-400 mb-3">{stat.value}</div>
                <div className="text-xl font-semibold text-white mb-2">{stat.label}</div>
                <div className="text-sm text-slate-400 leading-relaxed">{stat.description}</div>
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

        {/* Live Demo Preview Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">See QAtalyst in Action</h3>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Watch how QAtalyst transforms your testing workflow in real-time
            </p>
          </div>
          
          <Card className="bg-slate-800 border-slate-700 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-400 text-sm ml-4">QAtalyst Dashboard</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="h-20 bg-slate-800 rounded border border-slate-600"></div>
                      <div className="h-20 bg-slate-800 rounded border border-slate-600"></div>
                      <div className="h-20 bg-slate-800 rounded border border-slate-600"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Play className="h-4 w-4 mr-2" />
                    Watch Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">What Our Users Say</h3>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Join thousands of satisfied QA professionals worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "QA Lead at TechCorp",
                content: "QAtalyst reduced our test creation time by 80%. The AI-generated scenarios are incredibly accurate and comprehensive.",
                rating: 5
              },
              {
                name: "Mike Rodriguez",
                role: "Senior Test Engineer",
                content: "The Playwright code generation is a game-changer. It produces clean, maintainable test code that actually works.",
                rating: 5
              },
              {
                name: "Emily Johnson",
                role: "DevOps Manager",
                content: "Integration with our CI/CD pipeline was seamless. Our test coverage improved dramatically within weeks.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-slate-300 mb-4 italic">"{testimonial.content}"</p>
                  <div className="border-t border-slate-700 pt-4">
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-slate-400 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Integration Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Seamless Integrations</h3>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Connect with your favorite tools and platforms
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              "GitHub", "GitLab", "Jenkins", "CircleCI", "Azure DevOps", "Jira",
              "Slack", "Teams", "Docker", "Kubernetes", "AWS", "Vercel"
            ].map((tool, index) => (
              <div key={index} className="flex items-center justify-center p-6 bg-slate-800 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors">
                <span className="text-slate-300 font-medium">{tool}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h3>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Everything you need to know about QAtalyst
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "How accurate are the AI-generated test scenarios?",
                answer: "Our AI has been trained on thousands of test scenarios and achieves 95%+ accuracy. It understands context, edge cases, and testing best practices."
              },
              {
                question: "Can I customize the generated Playwright code?",
                answer: "Absolutely! All generated code is fully editable. You can modify selectors, add custom logic, and integrate with your existing test framework."
              },
              {
                question: "Does QAtalyst support mobile testing?",
                answer: "Yes, QAtalyst generates Playwright code that supports mobile browsers and responsive testing across different viewport sizes."
              },
              {
                question: "How do I integrate QAtalyst with my CI/CD pipeline?",
                answer: "QAtalyst provides export options for all major CI/CD platforms including GitHub Actions, Jenkins, and Azure DevOps with ready-to-use configurations."
              }
            ].map((faq, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-white mb-3">{faq.question}</h4>
                  <p className="text-slate-300">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Choose Your Plan</h3>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Start free and scale as your team grows
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for individuals and small teams",
                features: ["5 test scenarios/month", "Basic Playwright generation", "Community support"],
                popular: false
              },
              {
                name: "Professional",
                price: "$29/mo",
                description: "For growing teams and complex projects",
                features: ["Unlimited test scenarios", "Advanced AI features", "Priority support", "CI/CD integrations"],
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations with specific needs",
                features: ["Custom AI training", "Dedicated support", "SLA guarantee", "On-premise deployment"],
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`${plan.popular ? 'border-blue-500 bg-gradient-to-b from-blue-600/10 to-slate-800' : 'bg-slate-800 border-slate-700'} relative`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
                  </div>
                )}
                <CardContent className="p-8 text-center">
                  <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
                  <div className="text-4xl font-bold text-blue-400 mb-2">{plan.price}</div>
                  <p className="text-slate-400 mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-slate-300">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 hover:bg-slate-600'}`}>
                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Final Stats Section */}
        <div className="mb-16">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold text-white mb-8">Trusted by Industry Leaders</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="text-4xl font-bold text-blue-400 mb-2">10,000+</div>
                  <div className="text-slate-300">Active Users</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-400 mb-2">500K+</div>
                  <div className="text-slate-300">Tests Generated</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-400 mb-2">50+</div>
                  <div className="text-slate-300">Countries</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-400 mb-2">99.9%</div>
                  <div className="text-slate-300">Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-500/30">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Testing?
            </h3>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
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