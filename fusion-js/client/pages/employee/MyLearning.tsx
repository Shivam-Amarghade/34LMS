import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Clock,
  CheckCircle,
  PlayCircle,
  BookOpen,
  ArrowRight,
  Target,
  Award,
  Calendar,
  Zap,
} from 'lucide-react';

// Mock learning data
const MOCK_ENROLLMENTS = [
  {
    enrollmentId: 'E001',
    pathId: 'LP001',
    pathName: 'Python Intermediate Path',
    competencyCode: 'COMP-001',
    competencyName: 'Python Programming',
    fromLevel: 'E1',
    toLevel: 'E3',
    enrollDate: '2024-12-15',
    status: 'ACTIVE',
    overallProgressPct: 40,
    totalSteps: 5,
    completedSteps: 2,
    currentStep: 'Python OOP Course',
    pointsEarned: 150,
  },
  {
    enrollmentId: 'E002',
    pathId: 'LP002',
    pathName: 'React Advanced Path',
    competencyCode: 'COMP-002',
    competencyName: 'React.js',
    fromLevel: 'E2',
    toLevel: 'E4',
    enrollDate: '2024-11-01',
    status: 'ACTIVE',
    overallProgressPct: 65,
    totalSteps: 6,
    completedSteps: 4,
    currentStep: 'Advanced Patterns & Best Practices',
    pointsEarned: 320,
  },
  {
    enrollmentId: 'E003',
    pathId: 'LP003',
    pathName: 'System Design Fundamentals',
    competencyCode: 'COMP-003',
    competencyName: 'System Design',
    fromLevel: 'E0',
    toLevel: 'E2',
    enrollDate: '2024-10-20',
    status: 'NOT_STARTED',
    overallProgressPct: 0,
    totalSteps: 4,
    completedSteps: 0,
    currentStep: 'Introduction to System Design',
    pointsEarned: 0,
  },
];

const MOCK_COMPLETED = [
  {
    enrollmentId: 'E004',
    pathId: 'LP004',
    pathName: 'Communication Skills Path',
    competencyName: 'Communication',
    completedDate: '2024-09-15',
    pointsEarned: 280,
    levelUpgrade: 'E1 → E2',
    badge: '🏆 Communication Master',
  },
  {
    enrollmentId: 'E005',
    pathId: 'LP005',
    pathName: 'Leadership Fundamentals',
    competencyName: 'Leadership',
    completedDate: '2024-08-30',
    pointsEarned: 200,
    levelUpgrade: 'E0 → E1',
    badge: '📚 Emerging Leader',
  },
];

export default function MyLearning() {
  const competencies = useCompetencyStore((state) => state.profile.data);

  const inProgressCount = MOCK_ENROLLMENTS.filter(e => e.status === 'ACTIVE').length;
  const notStartedCount = MOCK_ENROLLMENTS.filter(e => e.status === 'NOT_STARTED').length;
  const completedCount = MOCK_COMPLETED.length;
  const totalHours = (inProgressCount * 18) + (notStartedCount * 15);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Learning</h1>
        <p className="text-muted-foreground mt-2">
          Track your learning paths, courses, and progress towards your goals
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground mt-1">active paths</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{completedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">paths finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Not Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{notStartedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">paths to begin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">~{totalHours}h</div>
            <p className="text-xs text-muted-foreground mt-1">estimated</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="in-progress" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="in-progress" className="gap-2">
            <PlayCircle className="h-4 w-4" />
            In Progress ({inProgressCount})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed ({completedCount})
          </TabsTrigger>
          <TabsTrigger value="not-started" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Not Started ({notStartedCount})
          </TabsTrigger>
        </TabsList>

        {/* In Progress Tab */}
        <TabsContent value="in-progress" className="space-y-4">
          {MOCK_ENROLLMENTS.filter(e => e.status === 'ACTIVE').length > 0 ? (
            MOCK_ENROLLMENTS.filter(e => e.status === 'ACTIVE').map(enrollment => (
              <Card key={enrollment.enrollmentId} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{enrollment.pathName}</h3>
                          <Badge className="bg-primary/10 text-primary">{enrollment.fromLevel} → {enrollment.toLevel}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {enrollment.competencyName} • Enrolled {new Date(enrollment.enrollDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-success/10 text-success">
                        <PlayCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>

                    {/* Current Step */}
                    <div className="p-3 rounded-lg bg-muted/50 border">
                      <p className="text-xs text-muted-foreground mb-1">Current Step</p>
                      <p className="font-medium text-sm">{enrollment.currentStep}</p>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {enrollment.completedSteps} of {enrollment.totalSteps} steps
                        </span>
                        <span className="font-medium">{enrollment.overallProgressPct}%</span>
                      </div>
                      <Progress value={enrollment.overallProgressPct} className="h-3" />
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-sm">
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-semibold">~18 hours</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Points Earned</p>
                        <p className="font-semibold text-success">+{enrollment.pointsEarned}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Level Up To</p>
                        <p className="font-semibold text-primary">{enrollment.toLevel}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-semibold text-primary">{enrollment.overallProgressPct}% Done</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap">
                      <Button className="gap-2 bg-primary hover:bg-primary/90" asChild>
                        <Link to={`/employee/learning/${enrollment.pathId}`}>
                          <ArrowRight className="h-4 w-4" />
                          Continue Learning
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to={`/employee/learning/${enrollment.pathId}`}>
                          View Full Path
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">No active learning paths</p>
                <Button asChild>
                  <Link to="/employee/gap-analysis">Explore Learning Paths</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed" className="space-y-4">
          {MOCK_COMPLETED.length > 0 ? (
            MOCK_COMPLETED.map(path => (
              <Card key={path.enrollmentId} className="bg-success/5 border-success/20">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{path.pathName}</h3>
                          <Badge className="bg-success/10 text-success gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Completed
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {path.competencyName} • Finished {new Date(path.completedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Achievement */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-success/5 border border-success/10">
                        <p className="text-xs text-muted-foreground mb-1">Level Upgrade</p>
                        <p className="font-semibold">{path.levelUpgrade}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                        <p className="text-xs text-muted-foreground mb-1">Points Earned</p>
                        <p className="font-semibold text-accent">+{path.pointsEarned}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <p className="text-xs text-muted-foreground mb-1">Badge Earned</p>
                        <p className="font-semibold">{path.badge}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/employee/learning/${path.pathId}`}>
                        View Certificate of Completion
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">No completed paths yet</p>
                <p className="text-sm text-muted-foreground">Complete a learning path to earn certificates and badges</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Not Started Tab */}
        <TabsContent value="not-started" className="space-y-4">
          {MOCK_ENROLLMENTS.filter(e => e.status === 'NOT_STARTED').length > 0 ? (
            MOCK_ENROLLMENTS.filter(e => e.status === 'NOT_STARTED').map(enrollment => (
              <Card key={enrollment.enrollmentId}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{enrollment.pathName}</h3>
                          <Badge variant="outline">{enrollment.fromLevel} → {enrollment.toLevel}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {enrollment.competencyName} • Enrolled {new Date(enrollment.enrollDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-warning/10 text-warning">
                        Not Started
                      </Badge>
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-sm">
                        <p className="text-muted-foreground">Steps</p>
                        <p className="font-semibold">{enrollment.totalSteps} steps</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-semibold">~18 hours</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">First Step</p>
                        <p className="font-semibold text-primary">Introduction</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Points Available</p>
                        <p className="font-semibold text-success">+{enrollment.pointsEarned}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                      <PlayCircle className="h-4 w-4" />
                      Start Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">No pending paths</p>
                <p className="text-sm text-muted-foreground">All enrolled paths have been started!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Learning Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>✓ Dedicate 1-2 hours per week to maintain steady progress</p>
          <p>✓ Complete assessments to unlock the next steps</p>
          <p>✓ Earn points and badges as you complete milestones</p>
          <p>✓ Return to Gap Analysis to prioritize critical skills</p>
        </CardContent>
      </Card>
    </div>
  );
}
