import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import { Target, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Predict = () => {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    price: 1000000,
    rating: 4.0,
    students: 1000,
    reviews: 100,
    duration: 600,
    discount: 0,
    lectures: 50,
    sections: 10,
  });

  const handlePredict = () => {
    // Mock prediction logic
    const baseProb = 0.3;
    const ratingBoost = (formData.rating - 3) * 0.15;
    const reviewBoost = Math.min(formData.reviews / 1000, 0.3);
    const priceBoost = formData.price > 30 ? 0.1 : 0;
    
    const probability = Math.min(Math.max(baseProb + ratingBoost + reviewBoost + priceBoost, 0), 1);
    setPrediction(probability);
  };

  const getConfidenceLevel = (prob: number) => {
    if (prob > 0.7) return { level: "High", color: "text-accent" };
    if (prob > 0.4) return { level: "Medium", color: "text-secondary" };
    return { level: "Low", color: "text-yellow-500" };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2 animate-fade-in text-center">
          <h1 className="text-4xl font-bold">Predict Course Success</h1>
          <p className="text-muted-foreground">Enter course details to predict bestseller probability</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Slider */}
              <div className="space-y-2">
                <Label className="flex justify-between">
                  <span>Price (VND)</span>
                  <span className="text-primary">{formData.price.toLocaleString()} đ</span>
                </Label>
                <Slider
                  value={[formData.price]}
                  onValueChange={([value]) => setFormData({ ...formData, price: value })}
                  max={5000000}
                  step={100000}
                  className="py-4"
                />
              </div>

              {/* Rating Slider */}
              <div className="space-y-2">
                <Label className="flex justify-between">
                  <span>Current Rating</span>
                  <span className="text-primary">{formData.rating.toFixed(1)}</span>
                </Label>
                <Slider
                  value={[formData.rating * 10]}
                  onValueChange={([value]) => setFormData({ ...formData, rating: value / 10 })}
                  min={10}
                  max={50}
                  step={1}
                  className="py-4"
                />
              </div>

              {/* Students */}
              <div className="space-y-2">
                <Label>Number of Students</Label>
                <Input
                  type="number"
                  value={formData.students}
                  onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) || 0 })}
                  className="bg-background/50"
                />
              </div>

              {/* Reviews */}
              <div className="space-y-2">
                <Label>Number of Reviews</Label>
                <Input
                  type="number"
                  value={formData.reviews}
                  onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) || 0 })}
                  className="bg-background/50"
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label>Total Duration (minutes)</Label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  className="bg-background/50"
                />
              </div>

              {/* Discount Slider */}
              <div className="space-y-2">
                <Label className="flex justify-between">
                  <span>Discount (%)</span>
                  <span className="text-primary">{formData.discount}%</span>
                </Label>
                <Slider
                  value={[formData.discount]}
                  onValueChange={([value]) => setFormData({ ...formData, discount: value })}
                  max={100}
                  step={5}
                  className="py-4"
                />
              </div>

              {/* Lectures & Sections */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Lectures</Label>
                  <Input
                    type="number"
                    value={formData.lectures}
                    onChange={(e) => setFormData({ ...formData, lectures: parseInt(e.target.value) || 0 })}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sections</Label>
                  <Input
                    type="number"
                    value={formData.sections}
                    onChange={(e) => setFormData({ ...formData, sections: parseInt(e.target.value) || 0 })}
                    className="bg-background/50"
                  />
                </div>
              </div>

              <Button onClick={handlePredict} className="w-full bg-primary hover:bg-primary/90 shadow-glow">
                <Target className="w-4 h-4 mr-2" />
                Predict Success
              </Button>
            </CardContent>
          </Card>

          {/* Prediction Results */}
          <div className="space-y-6">
            <Card className="gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Prediction Results</CardTitle>
              </CardHeader>
              <CardContent>
                {prediction !== null ? (
                  <div className="space-y-6 animate-scale-in">
                    {/* Probability Display */}
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 border-4 border-primary shadow-glow">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-primary">{(prediction * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Bestseller Probability</p>
                        <Progress value={prediction * 100} className="mt-2" />
                      </div>
                    </div>

                    {/* Confidence */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50">
                      <span className="text-sm text-muted-foreground">Model Confidence</span>
                      <span className={`font-semibold ${getConfidenceLevel(prediction).color}`}>
                        {getConfidenceLevel(prediction).level}
                      </span>
                    </div>

                    {/* Key Factors */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Key Factors
                      </h3>
                      <div className="space-y-2">
                        {formData.reviews > 50 && (
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-accent" />
                            <span>Strong review count</span>
                          </div>
                        )}
                        {formData.rating >= 4.3 && (
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-accent" />
                            <span>Excellent rating</span>
                          </div>
                        )}
                        {formData.price > 50 && (
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-accent" />
                            <span>Premium pricing</span>
                          </div>
                        )}
                        {prediction < 0.3 && (
                          <div className="flex items-center gap-2 text-sm text-yellow-500">
                            <AlertCircle className="w-4 h-4" />
                            <span>Consider improving rating or reviews</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Enter course details and click Predict to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;
