import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore, useCompetencyStore, useGamificationStore } from '@/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BookOpen,
  Target,
  Award,
  Zap,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Users,
} from 'lucide-react';

export default function EmployeeDashboard() {
  const user = useAuthStore((state) => state.user);
  const competency = useCompetencyStore((state) => state);
  const gamification = useGamificationStore((state) => state);
  const setProfile = useCompetencyStore((state) => state.setProfile);
  const setMyScore = useGamificationStore((state) => state.setMyScore);
  const setLeaderboard = useGamificationStore((state) => state.setLeaderboard);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1200));

      setProfile([
        {
          competencyCode: 'COMP-001',
          competencyName: 'Python Programming',
          currentLevel: 'E2',
          targetLevel: 'E4',
          isPrimary: true,
          status: 'ACTIVE',
          gap: 2,
        },
        {
          competencyCode: 'COMP-002',
          competencyName: 'React.js',
          currentLevel: 'E3',
          targetLevel: 'E3',
          isPrimary: true,
          status: 'ACTIVE',
          gap: 0,
        },
        {
          competencyCode: 'COMP-003',
          competencyName: 'System Design',
          currentLevel: 'E1',
          targetLevel: 'E3',
          isPrimary: false,
          status: 'ACTIVE',
          gap: 2,
        },
        {
          competencyCode: 'COMP-004',
          competencyName: 'Communication',
          currentLevel: 'E2',
          targetLevel: 'E3',
          isPrimary: false,
          status: 'EXPIRING',
          gap: 1,
        },
      ]);

      setMyScore({
        totalPoints: 3240,
        currentLevel: 'INTERMEDIATE',
        nextLevelMinPoints: 5000,
        badges: ['learner', 'course-master', 'fast-track'],
        tFactor: 7.2,
      });

      setLeaderboard({
        data: [
          { rank: 1, name: 'Sarah Chen', points: 5420, level: 'ADVANCED' },
          { rank: 2, name: 'Michael Kumar', points: 4890, level: 'ADVANCED' },
          { rank: 3, name: 'You', points: 3240, level: 'INTERMEDIATE' },
          { rank: 4, name: 'Emma Wilson', points: 2950, level: 'INTERMEDIATE' },
          { rank: 5, name: 'David Lee', points: 2680, level: 'INTERMEDIATE' },
        ],
        myRank: 3,
      });

      setLoading(false);
    };

    loadDashboardData();
  }, []);

  const competencyCount = competency.profile.data.length;
  const atTargetCount = competency.profile.data.filter(c => c.gap === 0).length;
  const belowTargetCount = competency.profile.data.filter(c => c.gap > 0).length;
  const expiringCount = competency.profile.data.filter(c => c.status === 'EXPIRING').length;

  const chartData = [
    { name: 'At Target', value: atTargetCount, fill: '#22c55e' },
    { name: 'Below Target', value: belowTargetCount, fill: '#f59e0b' },
  ];

  const progressData = [
    { name: 'Week 1', progress: 25 },
    { name: 'Week 2', progress: 35 },
    { name: 'Week 3', progress: 45 },
    { name: 'Week 4', progress: 60 },
  ];

  const gapAnalysisData = competency.profile.data.filter(c => c.gap > 0).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name}
        </h1>
        <p className="text-muted-foreground">
          {user?.designation} • {user?.department}
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Competency Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              My Competencies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold text-primary">{competencyCount}</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-success">At Target</span>
                <span className="font-medium">{atTargetCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warning">Below Target</span>
                <span className="font-medium">{belowTargetCount}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4" asChild>
              <Link to="/employee/competencies">View All</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Learning Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Active Learning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold text-primary">3</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>In Progress</span>
                <span className="font-medium">2</span>
              </div>
              <div className="flex justify-between">
                <span>Completed</span>
                <span className="font-medium">8</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4" asChild>
              <Link to="/employee/learning">View Paths</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Gamification */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Learning Level
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold text-primary">
              {gamification.myScore.totalPoints.toLocaleString()}
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground mb-2">
                {gamification.myScore.currentLevel}
              </p>
              <Progress
                value={
                  gamification.myScore.nextLevelMinPoints
                    ? (gamification.myScore.totalPoints /
                        gamification.myScore.nextLevelMinPoints) *
                      100
                    : 100
                }
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {gamification.myScore.nextLevelMinPoints
                  ? `${gamification.myScore.nextLevelMinPoints - gamification.myScore.totalPoints} pts to next level`
                  : 'Max level reached!'}
              </p>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4" asChild>
              <Link to="/employee/gamification">View Scorecard</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold text-primary">4</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-success">Verified</span>
                <span className="font-medium">4</span>
              </div>
              {expiringCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-warning">Expiring Soon</span>
                  <span className="font-medium">{expiringCount}</span>
                </div>
              )}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4" asChild>
              <Link to="/employee/certifications">View All</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Charts and Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Competency Status */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Competency Status</CardTitle>
            <CardDescription>Distribution of your competencies</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Learning Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>Completion rate over the month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="progress" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Competency Gaps and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gap Analysis Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Competency Gaps
            </CardTitle>
            <CardDescription>Skills below target level</CardDescription>
          </CardHeader>
          <CardContent>
            {gapAnalysisData.length > 0 ? (
              <div className="space-y-3">
                {gapAnalysisData.map(comp => (
                  <div
                    key={comp.competencyCode}
                    className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/10"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">
                        {comp.competencyName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {comp.currentLevel} → {comp.targetLevel} ({comp.gap} levels)
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-2 flex-shrink-0"
                      asChild
                    >
                      <Link to="/employee/learning">Enroll</Link>
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/employee/gap-analysis">
                    View Full Gap Analysis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">All competencies at target!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Team Leaderboard
            </CardTitle>
            <CardDescription>Top learners in your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {gamification.leaderboard.data.slice(0, 5).map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    entry.rank === 3
                      ? 'bg-primary/5 border border-primary/20'
                      : 'hover:bg-secondary'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        entry.rank === 1
                          ? 'bg-yellow-500 text-white'
                          : entry.rank === 2
                            ? 'bg-gray-400 text-white'
                            : entry.rank === 3
                              ? 'bg-primary text-white'
                              : 'bg-muted text-foreground'
                      }`}
                    >
                      {entry.rank}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {entry.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.points.toLocaleString()} pts
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-primary">
                    {entry.level}
                  </span>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/employee/gamification">
                  See Full Leaderboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto flex-col py-4" asChild>
              <Link to="/employee/learning">
                <BookOpen className="h-5 w-5 mb-2 text-primary" />
                <span className="text-xs text-center">Explore Learning</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4" asChild>
              <Link to="/employee/competencies">
                <Target className="h-5 w-5 mb-2 text-primary" />
                <span className="text-xs text-center">My Skills</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4" asChild>
              <Link to="/employee/certifications">
                <Award className="h-5 w-5 mb-2 text-primary" />
                <span className="text-xs text-center">Certifications</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4" asChild>
              <Link to="/employee/gamification">
                <TrendingUp className="h-5 w-5 mb-2 text-primary" />
                <span className="text-xs text-center">My Stats</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
