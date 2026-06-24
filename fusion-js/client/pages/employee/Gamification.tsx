import { useState } from 'react';
import { useGamificationStore } from '@/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  Award,
  Flame,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

const BADGES_DATA = [
  {
    id: 'badge-1',
    name: 'Learner',
    description: 'Complete your first course',
    icon: '📚',
    unlocked: true,
    unlockedDate: '2024-01-15',
  },
  {
    id: 'badge-2',
    name: 'Consistent Learner',
    description: 'Complete courses for 4 consecutive weeks',
    icon: '📖',
    unlocked: true,
    unlockedDate: '2024-02-10',
  },
  {
    id: 'badge-3',
    name: 'Course Master',
    description: 'Complete 5 courses',
    icon: '🎓',
    unlocked: true,
    unlockedDate: '2024-03-20',
  },
  {
    id: 'badge-4',
    name: 'Skill Multiplier',
    description: 'Master 3 different competencies',
    icon: '⚡',
    unlocked: true,
    unlockedDate: '2024-04-05',
  },
  {
    id: 'badge-5',
    name: 'Path Completer',
    description: 'Complete a learning path',
    icon: '✨',
    unlocked: false,
    progress: 60,
  },
  {
    id: 'badge-6',
    name: 'Champion',
    description: 'Reach 5000 points',
    icon: '👑',
    unlocked: false,
    progress: 65,
  },
];

const LEADERBOARD_DATA = [
  {
    rank: 1,
    name: 'Sarah Chen',
    points: 5420,
    level: 'ADVANCED',
    levelColor: 'text-orange-600',
    badge: '🥇',
    department: 'Engineering',
  },
  {
    rank: 2,
    name: 'Michael Kumar',
    points: 4890,
    level: 'ADVANCED',
    levelColor: 'text-orange-600',
    badge: '🥈',
    department: 'Engineering',
  },
  {
    rank: 3,
    name: 'You',
    points: 3240,
    level: 'INTERMEDIATE',
    levelColor: 'text-cyan-600',
    badge: '🥉',
    department: 'Engineering',
    isCurrentUser: true,
  },
  {
    rank: 4,
    name: 'Emma Wilson',
    points: 2950,
    level: 'INTERMEDIATE',
    levelColor: 'text-cyan-600',
    department: 'Product',
  },
  {
    rank: 5,
    name: 'David Lee',
    points: 2680,
    level: 'INTERMEDIATE',
    levelColor: 'text-cyan-600',
    department: 'Design',
  },
  {
    rank: 6,
    name: 'Jessica Tang',
    points: 2340,
    level: 'INTERMEDIATE',
    levelColor: 'text-cyan-600',
    department: 'Engineering',
  },
  {
    rank: 7,
    name: 'Alex Brown',
    points: 1890,
    level: 'BEGINNER',
    levelColor: 'text-gray-600',
    department: 'Marketing',
  },
  {
    rank: 8,
    name: 'Jordan Smith',
    points: 1450,
    level: 'BEGINNER',
    levelColor: 'text-gray-600',
    department: 'HR',
  },
];

const POINTS_HISTORY = [
  { month: 'Jan', points: 450 },
  { month: 'Feb', points: 620 },
  { month: 'Mar', points: 780 },
  { month: 'Apr', points: 690 },
  { month: 'May', points: 700 },
];

export default function Gamification() {
  const gamification = useGamificationStore((state) => state);
  const [leaderboardScope, setLeaderboardScope] = useState<'team' | 'department'>('team');

  const myScore = gamification.myScore;
  const pointsToNextLevel = myScore.nextLevelMinPoints 
    ? myScore.nextLevelMinPoints - myScore.totalPoints 
    : 0;
  const nextLevelProgress = myScore.nextLevelMinPoints
    ? (myScore.totalPoints / myScore.nextLevelMinPoints) * 100
    : 100;

  const unlockedBadges = BADGES_DATA.filter(b => b.unlocked).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Learning Gamification</h1>
        <p className="text-muted-foreground mt-2">
          Track your progress, earn badges, and compete on the leaderboard
        </p>
      </div>

      {/* Main Score Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Points */}
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-sm mb-2">Total Points</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  {myScore.totalPoints.toLocaleString()}
                </span>
                <Zap className="h-6 w-6 text-primary" />
              </div>
            </div>

            {/* Current Level */}
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-sm mb-2">Current Level</p>
              <Badge className="text-lg px-3 py-2 bg-primary text-white">
                {myScore.currentLevel}
              </Badge>
            </div>

            {/* Badges */}
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-sm mb-2">Badges Earned</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-success">{unlockedBadges}</span>
                <Award className="h-6 w-6 text-success" />
              </div>
            </div>

            {/* T-Factor */}
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-sm mb-2">T-Factor Index</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-accent">{myScore.tFactor}</span>
                <Target className="h-6 w-6 text-accent" />
              </div>
            </div>
          </div>

          {/* Progress to Next Level */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress to Next Level</span>
              <span className="text-sm text-muted-foreground">
                {pointsToNextLevel > 0 ? `${pointsToNextLevel} points to go` : 'Max level reached!'}
              </span>
            </div>
            <Progress value={nextLevelProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="badges" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="badges" className="gap-2">
            <Award className="h-4 w-4" />
            Badges ({unlockedBadges}/{BADGES_DATA.length})
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="gap-2">
            <Users className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {BADGES_DATA.map(badge => (
              <Card
                key={badge.id}
                className={badge.unlocked ? '' : 'opacity-50 bg-muted/30'}
              >
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-3">{badge.icon}</div>
                  <h3 className="font-semibold text-sm mb-1">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{badge.description}</p>

                  {badge.unlocked ? (
                    <div>
                      <Badge className="bg-success/10 text-success text-xs">
                        ✓ Unlocked
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(badge.unlockedDate!).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Progress value={badge.progress || 0} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {badge.progress}% progress
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-4">
          {/* Scope Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setLeaderboardScope('team')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                leaderboardScope === 'team'
                  ? 'bg-primary text-white'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              Team
            </button>
            <button
              onClick={() => setLeaderboardScope('department')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                leaderboardScope === 'department'
                  ? 'bg-primary text-white'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              Department
            </button>
          </div>

          {/* Leaderboard Table */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {LEADERBOARD_DATA.map((entry, index) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      entry.isCurrentUser
                        ? 'bg-primary/5 border-primary/20'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    {/* Rank & Name */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="text-center">
                        <span className="text-2xl font-bold">{entry.badge}</span>
                        <p className="text-xs text-muted-foreground">{entry.rank}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm">{entry.name}</p>
                        <p className="text-xs text-muted-foreground">{entry.department}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <p className="font-bold text-lg">{entry.points.toLocaleString()}</p>
                        <Badge
                          className={`text-xs ${
                            entry.level === 'ADVANCED'
                              ? 'bg-orange-100 text-orange-700'
                              : entry.level === 'INTERMEDIATE'
                                ? 'bg-cyan-100 text-cyan-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {entry.level}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Points Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Points History</CardTitle>
              <CardDescription>Monthly points earned</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={POINTS_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="points"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ fill: '#2563eb', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* T-Factor Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                T-Factor Learning Index
              </CardTitle>
              <CardDescription>
                Your breadth and depth of competencies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Breadth */}
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold mb-2">Breadth</p>
                    <p className="text-2xl font-bold text-primary">4</p>
                    <p className="text-sm text-muted-foreground">
                      competencies at E1+
                    </p>
                  </div>
                  <Progress value={80} className="h-3" />
                </div>

                {/* Depth */}
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold mb-2">Depth</p>
                    <p className="text-2xl font-bold text-primary">3.2</p>
                    <p className="text-sm text-muted-foreground">
                      average advanced levels
                    </p>
                  </div>
                  <Progress value={64} className="h-3" />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-2">
                  Your T-Factor of 7.2 indicates a balanced combination of breadth
                  (multiple skills) and depth (mastery in key areas). This is ideal
                  for senior technical roles.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contribution Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Points Breakdown</CardTitle>
              <CardDescription>What earned you points</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: 'Courses', points: 1200 },
                    { name: 'Assessments', points: 800 },
                    { name: 'Certifications', points: 700 },
                    { name: 'Gamification', points: 540 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="points" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            How Gamification Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="space-y-1">
            <p><strong className="text-foreground">📚 Courses:</strong> Complete courses to earn 150-300 points each</p>
            <p><strong className="text-foreground">✓ Assessments:</strong> Pass assessments to earn 100-200 points</p>
            <p><strong className="text-foreground">🏆 Certifications:</strong> Submit certifications to earn 200-400 points</p>
            <p><strong className="text-foreground">📈 Levels:</strong> 0-100 (Beginner) → 100-500 (Intermediate) → 500-1000 (Advanced) → 1000+ (Champion)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
