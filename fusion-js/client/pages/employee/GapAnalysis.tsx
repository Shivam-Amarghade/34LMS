import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCompetencyStore } from '@/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter,
  Cell,
} from 'recharts';
import {
  Download,
  TrendingDown,
  Target,
  BookOpen,
  Award,
  ArrowRight,
  AlertCircle,
  Filter,
} from 'lucide-react';

export default function GapAnalysis() {
  const competencies = useCompetencyStore((state) => state.profile.data);
  const [sortBy, setSortBy] = useState<'gap' | 'name' | 'recent'>('gap');

  // Filter competencies with gaps
  const gappedCompetencies = useMemo(() => {
    const gapped = competencies.filter(c => c.gap > 0);
    
    switch (sortBy) {
      case 'gap':
        return gapped.sort((a, b) => b.gap - a.gap);
      case 'name':
        return gapped.sort((a, b) => a.competencyName.localeCompare(b.competencyName));
      case 'recent':
        return gapped.sort((a, b) => b.competencyCode.localeCompare(a.competencyCode));
      default:
        return gapped;
    }
  }, [competencies, sortBy]);

  // Summary stats
  const stats = useMemo(() => ({
    totalGaps: gappedCompetencies.length,
    atTarget: competencies.filter(c => c.gap === 0).length,
    belowTarget: competencies.filter(c => c.gap > 0).length,
    avgGap: gappedCompetencies.length > 0
      ? (gappedCompetencies.reduce((sum, c) => sum + c.gap, 0) / gappedCompetencies.length).toFixed(1)
      : 0,
  }), [competencies, gappedCompetencies]);

  // Chart data
  const chartData = gappedCompetencies.slice(0, 8).map(comp => ({
    name: comp.competencyName,
    current: parseInt(comp.currentLevel.substring(1)),
    target: parseInt(comp.targetLevel.substring(1)),
    gap: comp.gap,
  }));

  const distributionData = [
    { gap: '1 Level', count: gappedCompetencies.filter(c => c.gap === 1).length, fill: '#f59e0b' },
    { gap: '2 Levels', count: gappedCompetencies.filter(c => c.gap === 2).length, fill: '#ef4444' },
    { gap: '3+ Levels', count: gappedCompetencies.filter(c => c.gap >= 3).length, fill: '#991b1b' },
  ];

  const handleExport = () => {
    alert('Gap analysis exported as PDF. Download starting...');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Competency Gap Analysis</h1>
          <p className="text-muted-foreground mt-1">Identify skills to develop and recommended learning resources</p>
        </div>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.totalGaps}</div>
            <p className="text-xs text-muted-foreground mt-1">competencies below target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">At Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.atTarget}</div>
            <p className="text-xs text-muted-foreground mt-1">achieved target level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average Gap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.avgGap}</div>
            <p className="text-xs text-muted-foreground mt-1">levels to bridge</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {gappedCompetencies.filter(c => c.gap >= 2).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">critical gaps</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gap Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Competency Gaps</CardTitle>
              <CardDescription>Your current vs target proficiency levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" fill="#2563eb" name="Current Level" />
                  <Bar dataKey="target" fill="#f59e0b" name="Target Level" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gap Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gap Distribution</CardTitle>
              <CardDescription>How many levels you need to bridge</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {distributionData.map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.gap}</span>
                      <span className="text-sm text-muted-foreground">{item.count} competencies</span>
                    </div>
                    <Progress
                      value={(item.count / gappedCompetencies.length) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter & Sort */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gap Details</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border rounded-md px-2 py-1"
              >
                <option value="gap">Largest Gap</option>
                <option value="name">Name (A-Z)</option>
                <option value="recent">Recently Assigned</option>
              </select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Gap Cards */}
      <div className="space-y-4">
        {gappedCompetencies.length > 0 ? (
          gappedCompetencies.map((comp, index) => {
            const currentLevel = parseInt(comp.currentLevel.substring(1));
            const targetLevel = parseInt(comp.targetLevel.substring(1));
            const progressPct = (currentLevel / targetLevel) * 100;

            return (
              <Card key={comp.competencyCode} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{comp.competencyName}</h3>
                          {comp.gap >= 2 && (
                            <Badge className="bg-destructive/10 text-destructive gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Critical Gap
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{comp.competencyCode}</p>
                      </div>
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {comp.gap} level{comp.gap !== 1 ? 's' : ''}
                      </Badge>
                    </div>

                    {/* Progress Visualization */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {comp.currentLevel} → {comp.targetLevel}
                        </span>
                        <span className="font-medium">{Math.round(progressPct)}%</span>
                      </div>
                      <Progress value={progressPct} className="h-3" />
                    </div>

                    {/* Recommendations */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Learning Path */}
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-start gap-2 mb-2">
                          <BookOpen className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Recommended Path</p>
                            <p className="text-xs text-muted-foreground">
                              {comp.competencyName} Advanced Path
                            </p>
                            <p className="text-xs text-primary font-medium mt-1">~18 hours</p>
                          </div>
                        </div>
                        <Button size="sm" className="w-full h-8 bg-primary hover:bg-primary/90" asChild>
                          <Link to="/employee/learning">Enroll</Link>
                        </Button>
                      </div>

                      {/* Related Courses */}
                      <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                        <div className="flex items-start gap-2 mb-2">
                          <TrendingDown className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Courses</p>
                            <p className="text-xs text-muted-foreground">
                              3 related courses available
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="w-full h-8" asChild>
                          <Link to="/employee/learning">Browse Courses</Link>
                        </Button>
                      </div>

                      {/* Certifications */}
                      <div className="p-3 rounded-lg bg-success/5 border border-success/10">
                        <div className="flex items-start gap-2 mb-2">
                          <Award className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Certifications</p>
                            <p className="text-xs text-muted-foreground">
                              Industry certifications available
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="w-full h-8" asChild>
                          <Link to="/employee/certifications">Explore</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="h-12 w-12 text-success mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold text-foreground mb-2">All Set!</p>
              <p className="text-muted-foreground mb-6">
                You've achieved all your target competency levels. Great job!
              </p>
              <Button asChild>
                <Link to="/employee/learning">Explore More Learning Paths</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-primary" />
            How Gaps Are Calculated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Your gap is the difference between your current proficiency level and your target level.
          </p>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• <strong>1 Level Gap:</strong> Achievable with focused learning (~20-40 hours)</li>
            <li>• <strong>2 Level Gap:</strong> Requires structured learning path (~40-80 hours)</li>
            <li>• <strong>3+ Level Gap:</strong> Long-term development plan recommended</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
