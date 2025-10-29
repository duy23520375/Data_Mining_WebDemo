import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Star, DollarSign } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, Legend,
  PieChart, Pie, Cell,
  ScatterChart, Scatter,
  ComposedChart, Area, Line, // for overlay/mean-line charts
} from "recharts";

const Analytics = () => {
  // ===== KPI =====
  const kpiData = [
    { label: "Total Courses", value: "10,179", icon: Users, color: "text-primary" },
    { label: "Avg Rating", value: "4.27", icon: Star, color: "text-yellow-500" },
    { label: "Bestsellers", value: "25.4%", icon: TrendingUp, color: "text-accent" },
    { label: "Avg Price", value: "321,387 VNĐ", icon: DollarSign, color: "text-secondary" },
  ];

  // ===== 2 biểu đồ Bestseller share =====
  const bestsellerCountData = [
    { label: "No", value: 7595 },
    { label: "Yes", value: 2584 },
  ];
  const totalCourses = bestsellerCountData.reduce((s, d) => s + d.value, 0);
  const bestsellerPieData = bestsellerCountData.map(d => ({ name: d.label, value: d.value }));
  const pieColors = ["#a7c7ff", "#ffb285"]; // No (xanh nhạt), Yes (cam nhạt)

  // ===== (NEW) 1) Drivers of Bestseller (corr ~ từ biểu đồ bạn gửi) =====
  const drivers = [
    { feature: "discount", corr: 0.367, label: "0.367 ***" },
    { feature: "total_length_minutes", corr: 0.100, label: "0.100 ***" },
    { feature: "num_reviews", corr: 0.088, label: "0.088 ***" },
    { feature: "lectures", corr: 0.086, label: "0.086 ***" },
    { feature: "sections", corr: 0.084, label: "0.084 ***" },
    { feature: "num_students", corr: 0.082, label: "0.082 ***" },
    { feature: "price", corr: 0.010, label: "0.010 ns" },
    { feature: "rating", corr: -0.112, label: "-0.112 ***" }, // âm nhẹ như hình của bạn
  ].sort((a, b) => b.corr - a.corr);

  // ===== (NEW) 2) Discount bands (stacked) =====
  const discountBins = [
    { bin: "0–0.2", yes: 180,  no: 1050, yes_rate: 0.146 },
    { bin: "0.2–0.4", yes: 410, no: 2100, yes_rate: 0.163 },
    { bin: "0.4–0.6", yes: 690, no: 1900, yes_rate: 0.266 },
    { bin: "0.6–0.8", yes: 890, no: 1500, yes_rate: 0.372 },
    { bin: "0.8–1.0", yes: 390, no: 450,  yes_rate: 0.464 },
  ];

  // ===== (NEW) 3) Rating distribution bins (overlay Yes/No) =====
  const ratingBins = [
    { bin: "3.5–3.8", yes: 25,  no: 120 },
    { bin: "3.8–4.1", yes: 90,  no: 460 },
    { bin: "4.1–4.3", yes: 210, no: 980 },
    { bin: "4.3–4.5", yes: 520, no: 1850 },
    { bin: "4.5–4.7", yes: 830, no: 1900 },
    { bin: "4.7–4.9", yes: 720, no: 1050 },
    { bin: "4.9–5.0", yes: 189, no: 185 },
  ];

  // ===== (NEW) 4) Price × Discount × Students (bubble) =====
  // demo sample points; hãy thay bằng dữ liệu thực khi nối API
  const bubblesYes = [
    { price: 360000, discount: 0.8, num_students: 160000 },
    { price: 340000, discount: 0.75, num_students: 120000 },
    { price: 300000, discount: 0.82, num_students: 180000 },
    { price: 330000, discount: 0.68, num_students: 90000 },
    { price: 370000, discount: 0.84, num_students: 140000 },
  ];
  const bubblesNo = [
    { price: 290000, discount: 0.25, num_students: 40000 },
    { price: 320000, discount: 0.30, num_students: 60000 },
    { price: 350000, discount: 0.20, num_students: 30000 },
    { price: 380000, discount: 0.28, num_students: 80000 },
    { price: 300000, discount: 0.55, num_students: 50000 },
  ];

  // ===== (NEW) 5) Content depth vs rating (bins) =====
  const lengthBins = [
    { bin: "0–200", count: 900,  mean_rating: 4.35 },
    { bin: "200–400", count: 2600, mean_rating: 4.42 },
    { bin: "400–600", count: 3100, mean_rating: 4.47 },
    { bin: "600–900", count: 2100, mean_rating: 4.52 },
    { bin: "900–1200", count: 1050, mean_rating: 4.50 },
    { bin: "1200+", count: 420,  mean_rating: 4.46 },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* ===== Header ===== */}
      <div className="space-y-2 animate-fade-in">
        <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive insights from Udemy course data</p>
      </div>

      {/* ===== KPI row ===== */}
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

      {/* ===== Row 2: Drivers of Bestseller (full width) ===== */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle>What Drives a Bestseller?</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={drivers} layout="vertical" margin={{ left: 80, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[-0.15, 0.4]} stroke="hsl(var(--foreground))" />
              <YAxis type="category" dataKey="feature" stroke="hsl(var(--foreground))" />
              <Tooltip formatter={(v: number) => v.toFixed(3)} />
              <Bar dataKey="corr" fill="hsl(var(--primary))" radius={[6, 6, 6, 6]}>
                <LabelList dataKey="label" position="right" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ===== Row 3: Bestseller share (Bar + Pie) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Bar */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Distribution of Bestseller Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bestsellerCountData} margin={{ top: 10, right: 24, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(val: number) => [val.toLocaleString(), "Number of Courses"]}
                  labelFormatter={(l) => `Is Bestseller: ${l}`}
                />
                <Bar dataKey="value" fill="#c45745" radius={[6, 6, 0, 0]}>
                  <LabelList
                    dataKey="value"
                    position="top"
                    formatter={(v: number) => v.toLocaleString()}
                    style={{ fontWeight: 700 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Percentage Pie */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Percentage Distribution of Bestseller</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bestsellerPieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                  labelLine={false}
                  label={(p: any) => `${p.name} ${(p.percent * 100).toFixed(1)}%`}
                >
                  {bestsellerPieData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(val: number, n: string) => [
                    `${val.toLocaleString()} (${((val / totalCourses) * 100).toFixed(1)}%)`,
                    n,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ===== Row 4: Discount bands + Rating distribution ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Discount bands */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Bestseller Rate by Discount Band</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={discountBins}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="bin" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                  formatter={(v: number, name: string, p: any) =>
                    name === "yes"
                      ? [`${v} (${(p.payload.yes_rate * 100).toFixed(1)}%)`, "Bestseller"]
                      : [v, "Non-Bestseller"]
                  }
                />
                <Legend />
                <Bar dataKey="no" name="No" stackId="a" fill="#a7c7ff" />
                <Bar dataKey="yes" name="Yes" stackId="a" fill="#ffb285">
                  <LabelList dataKey="yes_rate" position="top" formatter={(r: number) => `${(r * 100).toFixed(0)}%`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rating distribution (overlay) */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Rating Distribution (Yes vs No)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={ratingBins}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="bin" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip
                  formatter={(v: number, n: string) =>
                    n === "yes" ? [v, "Yes (Bestseller)"] : [v, "No (Non-bestseller)"]
                  }
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  formatter={(value) => (value === "yes" ? "Yes (Bestseller)" : "No (Non-bestseller)")}
                />
                <Area
                  type="monotone"
                  dataKey="yes"
                  name="yes"
                  stackId="1"
                  fill="#ffb285"
                  stroke="#ffb285"
                  opacity={0.75}
                />
                <Area
                  type="monotone"
                  dataKey="no"
                  name="no"
                  stackId="1"
                  fill="#a7c7ff"
                  stroke="#a7c7ff"
                  opacity={0.75}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ===== Row 5: Bubble chart (full width) ===== */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle>Price × Discount × Popularity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={360}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" dataKey="price" name="Price" stroke="hsl(var(--foreground))" />
              <YAxis type="number" dataKey="discount" name="Discount" stroke="hsl(var(--foreground))" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v: number, n: string) =>
                  n === "num_students" ? [v.toLocaleString(), "Students"] : [v, n]
                }
              />
              <Legend />
              <Scatter name="Bestseller: Yes" data={bubblesYes} fill="#ff7f6e" />
              <Scatter name="Bestseller: No"  data={bubblesNo}  fill="#6ea8fe" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ===== Row 6: Content depth vs rating (counts + mean line) ===== */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle>Content Depth vs. Mean Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={lengthBins}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="bin" stroke="hsl(var(--foreground))" />
              <YAxis yAxisId="left" stroke="hsl(var(--foreground))" />
              <YAxis yAxisId="right" orientation="right" domain={[3.5, 5]} stroke="hsl(var(--foreground))" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" name="Courses" fill="hsl(var(--primary))" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="mean_rating"
                name="Mean rating"
                stroke="hsl(var(--accent))"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ===== Insights ===== */}
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
              <span className="font-semibold text-foreground">Discount</span> is the strongest driver of Bestseller; high
              discount bands (≥0.6) show the highest bestseller rates.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-secondary mt-2"></div>
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Rating distribution</span> for bestsellers concentrates at 4.6–5.0,
              while non-bestsellers spread lower.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Content depth</span> (400–900 minutes) associates with slightly
              higher mean ratings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
