import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Users, Clock, TrendingUp, Sparkles, Target } from "lucide-react";

const Recommend = () => {
  const [careerGoal, setCareerGoal] = useState("");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock course database with career paths
  const courseDatabase = [
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

  const handleRecommend = () => {
    setIsLoading(true);
    
    // Simulate sequential mining / recommendation algorithm
    setTimeout(() => {
      const query = careerGoal.toLowerCase();
      
      // Find courses that match the career goal
      const matchedCourses = courseDatabase.filter(course => {
        const careerMatch = course.careers.some(career => 
          career.includes(query) || query.includes(career.split(' ')[0])
        );
        const skillMatch = course.skills.some(skill => 
          query.includes(skill) || skill.includes(query)
        );
        return careerMatch || skillMatch;
      });

      // Sort by relevance (bestseller and rating)
      const sorted = matchedCourses.sort((a, b) => {
        if (a.isBestseller && !b.isBestseller) return -1;
        if (!a.isBestseller && b.isBestseller) return 1;
        return b.rating - a.rating;
      });

      setRecommendations(sorted);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4 animate-fade-in text-center">
          <h1 className="text-4xl font-bold">Course Recommendations</h1>
          <p className="text-muted-foreground">Enter your career goal to discover personalized course paths</p>

          {/* Career Goal Input */}
          <div className="max-w-2xl mx-auto space-y-4">
            <Card className="gradient-card border-border/50 p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Enter your career goal (e.g., AI Engineer, Web Developer, Data Scientist)..."
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRecommend()}
                    className="pl-10 h-12 bg-card/50 border-border/50"
                  />
                </div>
                <Button 
                  onClick={handleRecommend} 
                  disabled={!careerGoal.trim() || isLoading}
                  className="w-full bg-primary hover:bg-primary/90 shadow-glow"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isLoading ? "Finding courses..." : "Get Recommendations"}
                </Button>
              </div>
            </Card>

            {/* Sample Career Paths */}
            {recommendations.length === 0 && !isLoading && (
              <div className="flex flex-wrap gap-2 justify-center">
                <p className="text-sm text-muted-foreground w-full mb-2">Try these career paths:</p>
                {["AI Engineer", "Web Developer", "Data Scientist", "Cloud Architect", "NLP Engineer"].map((path) => (
                  <Button
                    key={path}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCareerGoal(path);
                      setTimeout(() => {
                        const btn = document.querySelector('button[class*="shadow-glow"]') as HTMLButtonElement;
                        btn?.click();
                      }, 100);
                    }}
                    className="text-xs"
                  >
                    {path}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recommendations Result */}
        {recommendations.length > 0 && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-semibold">
                Recommended Learning Path for "{careerGoal}"
              </h2>
            </div>
            <p className="text-muted-foreground">
              Found {recommendations.length} course{recommendations.length !== 1 ? 's' : ''} to help you become a {careerGoal}
            </p>

            {/* Course Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.map((course, index) => (
                <Card
                  key={course.id}
                  className="gradient-card border-border/50 hover:shadow-glow transition-smooth overflow-hidden group cursor-pointer"
                >
                  <CardContent className="p-6 space-y-4">
                    {/* Sequence Badge */}
                    <div className="flex items-start justify-between gap-4">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        Step {index + 1}
                      </Badge>
                      {course.isBestseller && (
                        <Badge className="bg-accent/10 text-accent border-accent/20 shrink-0">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Bestseller
                        </Badge>
                      )}
                    </div>

                    {/* Header */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{course.instructor}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-semibold">{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{(course.students / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {course.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <span className="text-2xl font-bold text-primary">${course.price}</span>
                      <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                        View Course
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {recommendations.length === 0 && careerGoal && !isLoading && (
          <Card className="gradient-card border-border/50 p-12 text-center">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try searching for different career goals like "AI Engineer", "Web Developer", or "Data Scientist"
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Recommend;
