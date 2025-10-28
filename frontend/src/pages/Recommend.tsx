import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Users, Clock, TrendingUp, Sparkles, Target, BookOpen, AlertCircle } from "lucide-react";
import { apiService, type RecommendationResponse, type Course } from "@/services/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Recommend = () => {
  const [targetTopic, setTargetTopic] = useState("");
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);

  // Load available topics khi component mount
  useEffect(() => {
    const loadTopics = async () => {
      try {
        const response = await apiService.getAvailableTopics();
        setAvailableTopics(response.topics);
      } catch (err) {
        console.error("Error loading topics:", err);
      }
    };
    loadTopics();
  }, []);

  // Popular suggested topics
  const suggestedTopics = [
    "Machine Learning",
    "React JS", 
    "Python",
    "Data Science",
    "Deep Learning",
    "JavaScript",
    "Artificial Intelligence (AI)",
    "Web Development"
  ];

  // Mock course database (DEPRECATED - now using API)
  const courseDatabase_DEPRECATED = [
    {
      id: 1,
      title: "Complete Python Bootcamp: Go from zero to hero in Python 3",
      instructor: "Jose Portilla",
      rating: 4.6,
      students: 1250000,
      price: 84.99,
      duration: "22 hours",
      level: "Beginner",
      category: "Development",
      isBestseller: true,
      skills: ["python", "programming", "data science", "ai", "machine learning"],
      careers: ["ai engineer", "data scientist", "python developer", "ml engineer"]
    },
    {
      id: 2,
      title: "Machine Learning A-Z™: AI, Python & R",
      instructor: "Kirill Eremenko",
      rating: 4.5,
      students: 950000,
      price: 94.99,
      duration: "44 hours",
      level: "Intermediate",
      category: "Data Science",
      isBestseller: true,
      skills: ["machine learning", "ai", "python", "deep learning", "neural networks"],
      careers: ["ai engineer", "ml engineer", "data scientist", "ai researcher"]
    },
    {
      id: 3,
      title: "Deep Learning Specialization",
      instructor: "Andrew Ng",
      rating: 4.8,
      students: 750000,
      price: 99.99,
      duration: "36 hours",
      level: "Advanced",
      category: "AI & ML",
      isBestseller: true,
      skills: ["deep learning", "neural networks", "tensorflow", "ai", "computer vision"],
      careers: ["ai engineer", "ml engineer", "deep learning engineer", "ai researcher"]
    },
    {
      id: 4,
      title: "The Web Developer Bootcamp 2024",
      instructor: "Colt Steele",
      rating: 4.7,
      students: 850000,
      price: 79.99,
      duration: "63.5 hours",
      level: "Beginner",
      category: "Development",
      isBestseller: true,
      skills: ["html", "css", "javascript", "react", "node.js", "web development"],
      careers: ["web developer", "frontend developer", "fullstack developer", "software engineer"]
    },
    {
      id: 5,
      title: "React - The Complete Guide 2024",
      instructor: "Maximilian Schwarzmüller",
      rating: 4.6,
      students: 620000,
      price: 89.99,
      duration: "48 hours",
      level: "Intermediate",
      category: "Development",
      isBestseller: true,
      skills: ["react", "javascript", "frontend", "web development", "hooks"],
      careers: ["frontend developer", "react developer", "web developer", "ui developer"]
    },
    {
      id: 6,
      title: "AWS Certified Solutions Architect",
      instructor: "Stephane Maarek",
      rating: 4.7,
      students: 680000,
      price: 84.99,
      duration: "27 hours",
      level: "Intermediate",
      category: "Cloud Computing",
      isBestseller: true,
      skills: ["aws", "cloud", "devops", "infrastructure", "architecture"],
      careers: ["cloud architect", "devops engineer", "cloud engineer", "solutions architect"]
    },
    {
      id: 7,
      title: "Natural Language Processing - NLP with Python",
      instructor: "Jose Portilla",
      rating: 4.5,
      students: 420000,
      price: 89.99,
      duration: "18 hours",
      level: "Advanced",
      category: "AI & ML",
      isBestseller: false,
      skills: ["nlp", "python", "ai", "text processing", "machine learning"],
      careers: ["ai engineer", "nlp engineer", "ml engineer", "data scientist"]
    },
  ];

  const handleRecommend = async () => {
    if (!targetTopic.trim()) return;
    
    setIsLoading(true);
    setError("");
    setRecommendations(null);
    
    try {
      // Gọi API để lấy recommendations
      const response = await apiService.getRecommendations({
        target_topic: targetTopic,
        max_steps: undefined, // Lấy toàn bộ path
        courses_per_step: 3
      });
      
      if (response.success) {
        setRecommendations(response);
      } else {
        setError(response.message || "Không tìm thấy learning path cho topic này.");
      }
    } catch (err: any) {
      console.error("Error getting recommendations:", err);
      setError(err.message || "Có lỗi xảy ra khi lấy recommendations. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000).toFixed(0)}K VND`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatStudents = (students: number) => {
    if (students >= 1000000) {
      return `${(students / 1000000).toFixed(1)}M`;
    } else if (students >= 1000) {
      return `${(students / 1000).toFixed(0)}K`;
    }
    return students.toString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4 animate-fade-in text-center">
          <h1 className="text-4xl font-bold">Sequential Mining Recommendations</h1>
          <p className="text-muted-foreground">
            Nhập topic/skill bạn muốn học để nhận learning path được gợi ý dựa trên Sequential Mining
          </p>

          {/* Topic Input */}
          <div className="max-w-2xl mx-auto space-y-4">
            <Card className="gradient-card border-border/50 p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Ví dụ: Machine Learning, React JS, Python, Data Science..."
                    value={targetTopic}
                    onChange={(e) => setTargetTopic(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRecommend()}
                    className="pl-10 h-12 bg-card/50 border-border/50"
                  />
                </div>
                <Button 
                  onClick={handleRecommend} 
                  disabled={!targetTopic.trim() || isLoading}
                  className="w-full bg-primary hover:bg-primary/90 shadow-glow"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isLoading ? "Đang tìm kiếm..." : "Tìm Learning Path"}
                </Button>
              </div>
            </Card>

            {/* Suggested Topics */}
            {!recommendations && !isLoading && !error && (
              <div className="flex flex-wrap gap-2 justify-center">
                <p className="text-sm text-muted-foreground w-full mb-2">Các topic phổ biến:</p>
                {suggestedTopics.map((topic) => (
                  <Button
                    key={topic}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTargetTopic(topic);
                      setTimeout(() => handleRecommend(), 100);
                    }}
                    className="text-xs"
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Recommendations Result */}
        {recommendations && recommendations.success && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-semibold">
                  Learning Path: {recommendations.target_topic}
                </h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {recommendations.total_steps} bước học
                </span>
                <span>•</span>
                <span>Path: {recommendations.path.join(" → ")}</span>
              </div>
            </div>

            {/* Learning Steps */}
            <div className="space-y-6">
              {recommendations.steps.map((step) => (
                <div key={step.step_number} className="space-y-3">
                  {/* Step Header */}
                  <div className="flex items-center gap-3">
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-base px-3 py-1">
                      Bước {step.step_number}
                    </Badge>
                    <h3 className="text-xl font-semibold">{step.topic}</h3>
                  </div>

                  {/* Courses for this step */}
                  {step.has_courses ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {step.courses.map((course: Course, idx: number) => (
                        <Card
                          key={idx}
                          className="gradient-card border-border/50 hover:shadow-glow transition-smooth overflow-hidden group cursor-pointer"
                          onClick={() => window.open(course.url, '_blank')}
                        >
                          <CardContent className="p-5 space-y-3">
                            {/* Bestseller Badge */}
                            {course.is_bestseller && (
                              <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Bestseller
                              </Badge>
                            )}

                            {/* Title */}
                            <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                              {course.title}
                            </h4>

                            {/* Instructor */}
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {course.instructor}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center gap-3 text-xs">
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                                <span className="font-semibold">{course.rating.toFixed(1)}</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Users className="w-3.5 h-3.5" />
                                <span>{formatStudents(course.students)}</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{course.duration}</span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between pt-2 border-t border-border/50">
                              <span className="text-lg font-bold text-primary">
                                {formatPrice(course.price)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {course.lectures} lectures
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed border-2 border-border/50 p-6">
                      <p className="text-sm text-muted-foreground text-center">
                        Không tìm thấy khóa học cho topic này trong catalog
                      </p>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!recommendations && !isLoading && !error && targetTopic && (
          <Card className="gradient-card border-border/50 p-12 text-center">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Chưa có kết quả</h3>
            <p className="text-muted-foreground">
              Hãy thử tìm kiếm với các topic như "Machine Learning", "React JS", hoặc "Python"
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Recommend;
