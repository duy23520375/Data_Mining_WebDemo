import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Star, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const Analytics = () => {
  // Mock data
  const kpiData = [
    { label: "Total Courses", value: "12,450", icon: Users, color: "text-primary" },
    { label: "Avg Rating", value: "4.3", icon: Star, color: "text-yellow-500" },
    { label: "Bestsellers", value: "18.5%", icon: TrendingUp, color: "text-accent" },
    { label: "Avg Price", value: "$45", icon: DollarSign, color: "text-secondary" },
  ];

  const ratingData = [
    { rating: "1-2", count: 450 },
    { rating: "2-3", count: 1200 },
    { rating: "3-4", count: 3800 },
    { rating: "4-4.5", count: 4200 },
    { rating: "4.5-5", count: 2800 },
  ];

  const categoryData = [
    { name: "Development", value: 3500, color: "hsl(var(--primary))" },
    { name: "Business", value: 2800, color: "hsl(var(--secondary))" },
    { name: "Design", value: 2100, color: "hsl(var(--accent))" },
    { name: "Marketing", value: 1900, color: "#8b5cf6" },
    { name: "Others", value: 2150, color: "#6366f1" },
  ];

  const priceVsRating = [
    { price: "$0-20", rating: 4.1 },
    { price: "$20-50", rating: 4.3 },
    { price: "$50-100", rating: 4.5 },
    { price: "$100+", rating: 4.6 },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2 animate-fade-in">
        <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive insights from Udemy course data</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="gradient-card border-border/50 hover:shadow-glow transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    <p className="text-3xl font-bold mt-2">{kpi.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-background/50 ${kpi.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="rating" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem"
                  }} 
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Course Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Price vs Rating */}
        <Card className="gradient-card border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle>Price vs Rating Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceVsRating}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="price" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" domain={[3.5, 5]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem"
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="rating" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--accent))", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Box */}
      <Card className="gradient-card border-primary/30 shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            AI-Generated Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Number of reviews</span> has the strongest correlation with bestseller status (correlation: 0.73)
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-secondary mt-2"></div>
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Higher-priced courses</span> tend to have slightly better ratings on average
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Development category</span> dominates with 28% of all courses
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
