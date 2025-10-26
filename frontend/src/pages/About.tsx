import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Database, Zap, TrendingUp, GitBranch, CheckCircle } from "lucide-react";

const About = () => {
  const mlPipeline = [
    { step: "Data Collection", icon: Database, desc: "Scraped 12K+ Udemy courses" },
    { step: "Feature Engineering", icon: GitBranch, desc: "Extracted 25+ features" },
    { step: "Model Training", icon: Brain, desc: "AutoML with XGBoost, Random Forest" },
    { step: "Deployment", icon: Zap, desc: "Real-time prediction API" },
  ];

  const modelComparison = [
    { model: "Random Forest", accuracy: "87.3%", precision: "85.1%", recall: "84.2%" },
    { model: "XGBoost", accuracy: "89.7%", precision: "88.4%", recall: "87.9%" },
    { model: "Logistic Regression", accuracy: "82.1%", precision: "80.5%", recall: "79.8%" },
    { model: "Neural Network", accuracy: "86.5%", precision: "84.8%", recall: "83.6%" },
  ];

  const topFeatures = [
    { name: "num_reviews", importance: 0.28, desc: "Number of course reviews" },
    { name: "rating", importance: 0.22, desc: "Average course rating" },
    { name: "num_students", importance: 0.18, desc: "Total enrolled students" },
    { name: "price", importance: 0.12, desc: "Course price" },
    { name: "total_duration", importance: 0.08, desc: "Total course hours" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2 animate-fade-in text-center">
          <h1 className="text-4xl font-bold">About This Project</h1>
          <p className="text-muted-foreground">Machine Learning Explainability & Architecture</p>
        </div>

        {/* Project Overview */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              This project leverages advanced machine learning techniques to analyze Udemy course data, predict course success (bestseller probability), 
              and provide personalized course recommendations. Built with AutoML frameworks and modern web technologies, it demonstrates the full ML pipeline 
              from data collection to production deployment.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20">Machine Learning</Badge>
              <Badge className="bg-secondary/10 text-secondary border-secondary/20">AutoML</Badge>
              <Badge className="bg-accent/10 text-accent border-accent/20">React</Badge>
              <Badge className="bg-primary/10 text-primary border-primary/20">TypeScript</Badge>
              <Badge className="bg-secondary/10 text-secondary border-secondary/20">Python</Badge>
            </div>
          </CardContent>
        </Card>

        {/* ML Pipeline */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle>ML Pipeline Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {mlPipeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="relative">
                    {index < mlPipeline.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary/30 -z-10" />
                    )}
                    <div className="space-y-3 text-center">
                      <div className="w-16 h-16 mx-auto rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.step}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Model Comparison */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Model Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4">Model</th>
                    <th className="text-right py-3 px-4">Accuracy</th>
                    <th className="text-right py-3 px-4">Precision</th>
                    <th className="text-right py-3 px-4">Recall</th>
                  </tr>
                </thead>
                <tbody>
                  {modelComparison.map((model, index) => (
                    <tr key={index} className="border-b border-border/30 hover:bg-background/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{model.model}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={index === 1 ? "text-accent font-semibold" : ""}>
                          {model.accuracy}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">{model.precision}</td>
                      <td className="py-3 px-4 text-right">{model.recall}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/20">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-accent">Best Model: XGBoost</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    XGBoost achieved the highest accuracy (89.7%) and was selected for production deployment
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SHAP Feature Importance */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle>SHAP Feature Importance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topFeatures.map((feature, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{feature.name}</span>
                  <span className="text-primary">{(feature.importance * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                    style={{ width: `${feature.importance * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Technologies */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Technologies Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-primary">Backend & ML</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Python, Pandas, NumPy for data processing
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Scikit-learn, XGBoost for ML models
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    SHAP for model explainability
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-secondary">Frontend</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                    React, TypeScript, Tailwind CSS
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                    Recharts for data visualization
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                    Radix UI for accessible components
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
