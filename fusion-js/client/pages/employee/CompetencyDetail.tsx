import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCompetencyStore } from '@/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle,
  Book,
  Award,
  Target,
  TrendingUp,
} from 'lucide-react';

const PROFICIENCY_LEVELS = [
  { level: 'E0', name: 'Beginner', description: 'Foundational knowledge', color: 'bg-gray-100' },
  { level: 'E1', name: 'Basic', description: 'Can work independently', color: 'bg-blue-100' },
  { level: 'E2', name: 'Intermediate', description: 'Good practical experience', color: 'bg-cyan-100' },
  { level: 'E3', name: 'Advanced', description: 'Expert level knowledge', color: 'bg-orange-100' },
  { level: 'E4', name: 'Expert', description: 'Can mentor others', color: 'bg-green-100' },
];

export default function CompetencyDetail() {
  const { code } = useParams<{ code: string }>();
  const competencies = useCompetencyStore((state) => state.profile.data);
  const competency = competencies.find(c => c.competencyCode === code);
  const [experienceYears, setExperienceYears] = useState('3');
  const [isSaving, setIsSaving] = useState(false);

  if (!competency) {
    return (
      <div className="space-y-6">
        <Link to="/employee/competencies" className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to Competencies
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Competency not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveExperience = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
  };

  const currentLevelIndex = parseInt(competency.currentLevel.substring(1));
  const targetLevelIndex = parseInt(competency.targetLevel.substring(1));

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link to="/employee/competencies" className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
        <ArrowRight className="h-4 w-4 rotate-180" />
        Back to Competencies
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{competency.competencyName}</h1>
            <p className="text-muted-foreground text-sm mt-1">{competency.competencyCode}</p>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-2">
            {competency.isPrimary ? '⭐ Primary' : 'Secondary'}
          </Badge>
        </div>

        {/* Status Row */}
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-primary/10 text-primary">
            {competency.status}
          </Badge>
          {competency.status === 'EXPIRING' && (
            <Badge className="bg-warning/10 text-warning">
              <AlertCircle className="h-3 w-3 mr-1" />
              Expires in 20 days
            </Badge>
          )}
        </div>
      </div>

      {/* Current vs Target Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Level */}
            <div className="p-4 rounded-lg bg-muted/50 border">
              <p className="text-sm text-muted-foreground mb-2">Current Level</p>
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                  {competency.currentLevel}
                </div>
                <div>
                  <p className="font-semibold">Basic Proficiency</p>
                  <p className="text-sm text-muted-foreground">Can work independently</p>
                </div>
              </div>
            </div>

            {/* Gap */}
            <div className="p-4 rounded-lg bg-muted/50 border flex flex-col justify-center items-center">
              <ArrowRight className="h-6 w-6 text-warning mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                {competency.gap} level{competency.gap !== 1 ? 's' : ''} to target
              </p>
              {competency.gap > 0 && (
                <p className="text-xs text-warning mt-2 font-semibold">Gap Identified</p>
              )}
            </div>

            {/* Target Level */}
            <div className="p-4 rounded-lg bg-muted/50 border">
              <p className="text-sm text-muted-foreground mb-2">Target Level</p>
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-2xl">
                  {competency.targetLevel}
                </div>
                <div>
                  <p className="font-semibold">Advanced Proficiency</p>
                  <p className="text-sm text-muted-foreground">Expert level knowledge</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {competency.gap > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress to Target</span>
                <span className="font-medium">{Math.round((currentLevelIndex / targetLevelIndex) * 100)}%</span>
              </div>
              <Progress
                value={(currentLevelIndex / targetLevelIndex) * 100}
                className="h-3"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Proficiency Level Ladder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Proficiency Level Framework</CardTitle>
          <CardDescription>Your journey from beginner to expert</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {PROFICIENCY_LEVELS.map((level, index) => {
              const isAchieved = index <= currentLevelIndex;
              const isTarget = level.level === competency.targetLevel;

              return (
                <div
                  key={level.level}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isTarget
                      ? 'border-primary bg-primary/5'
                      : isAchieved
                        ? 'border-success bg-success/5'
                        : 'border-muted'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-lg ${level.color} flex items-center justify-center font-bold shrink-0`}>
                      {level.level}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{level.name}</h3>
                        {isAchieved && <CheckCircle className="h-4 w-4 text-success" />}
                        {isTarget && <Target className="h-4 w-4 text-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{level.description}</p>
                      {level.level === 'E1' && (
                        <div className="text-xs text-muted-foreground mt-2 space-y-1">
                          <p>• Can complete tasks independently</p>
                          <p>• Understands core concepts</p>
                          <p>• Minimal supervision needed</p>
                        </div>
                      )}
                      {level.level === 'E2' && (
                        <div className="text-xs text-muted-foreground mt-2 space-y-1">
                          <p>• Solves complex problems</p>
                          <p>• Helps team members</p>
                          <p>• No supervision needed</p>
                        </div>
                      )}
                      {level.level === 'E3' && (
                        <div className="text-xs text-muted-foreground mt-2 space-y-1">
                          <p>• Recognized expert</p>
                          <p>• Mentors others</p>
                          <p>• Sets best practices</p>
                        </div>
                      )}
                      {level.level === 'E4' && (
                        <div className="text-xs text-muted-foreground mt-2 space-y-1">
                          <p>• Industry-level expertise</p>
                          <p>• Shapes strategy</p>
                          <p>• Leads initiatives</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Experience Years */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Book className="h-4 w-4 text-primary" />
                    Years of Experience
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="50"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className="h-10"
                    />
                    <Button
                      onClick={handleSaveExperience}
                      disabled={isSaving}
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Self-declared experience in this competency</p>
                </div>

                {/* Assignment Info */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Assigned By
                  </label>
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="font-medium text-sm">Supervisor</p>
                    <p className="text-xs text-muted-foreground">John Smith (Manager)</p>
                  </div>
                </div>

                {/* Last Assessment */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Last Assessment
                  </label>
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="font-medium text-sm">Jan 15, 2024</p>
                    <p className="text-xs text-muted-foreground">Score: 78%</p>
                  </div>
                </div>

                {/* Valid Until */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    Valid Until
                  </label>
                  <div className={`p-3 rounded-lg border ${
                    competency.status === 'EXPIRING'
                      ? 'bg-warning/5 border-warning/20'
                      : 'bg-muted/50'
                  }`}>
                    <p className="font-medium text-sm">Feb 15, 2025</p>
                    <p className="text-xs text-muted-foreground">Annual re-validation required</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Learning Tab */}
        <TabsContent value="learning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Learning Path</CardTitle>
            </CardHeader>
            <CardContent>
              {competency.gap > 0 ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <h3 className="font-semibold mb-2">Python Intermediate Path</h3>
                    <p className="text-sm text-muted-foreground mb-4">E1 → E3 | 18 hours estimated</p>
                    <Progress value={40} className="mb-3" />
                    <p className="text-sm font-medium mb-4">Step 2 of 5 - 40% Complete</p>
                    <Button className="gap-2 bg-primary hover:bg-primary/90" asChild>
                      <Link to="/employee/learning">
                        <TrendingUp className="h-4 w-4" />
                        Continue Learning
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-4 opacity-70" />
                  <p className="text-muted-foreground mb-4">You've achieved the target level!</p>
                  <Button variant="outline" asChild>
                    <Link to="/employee/learning">Explore Other Paths</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: 'Jan 15, 2024', name: 'Python Level Assessment', score: 78, status: 'Passed' },
                  { date: 'Dec 01, 2023', name: 'Self-Assessment', score: 75, status: 'Passed' },
                  { date: 'Nov 10, 2023', name: 'Python Level Assessment', score: 65, status: 'Failed' },
                ].map((attempt, i) => (
                  <div key={i} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{attempt.name}</p>
                        <p className="text-xs text-muted-foreground">{attempt.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{attempt.score}%</p>
                        <Badge
                          className={
                            attempt.status === 'Passed'
                              ? 'bg-success/10 text-success'
                              : 'bg-warning/10 text-warning'
                          }
                        >
                          {attempt.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to={`/employee/competency/${code}/self-assess`}>
                  Take Self-Assessment
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evidence Tab */}
        <TabsContent value="evidence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evidence & Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border-2 border-dashed flex flex-col items-center justify-center py-8">
                  <Award className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground text-center">No evidence submitted yet</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Add Evidence
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        {competency.gap > 0 && (
          <>
            <Button className="gap-2 bg-primary hover:bg-primary/90" asChild>
              <Link to="/employee/learning">
                <TrendingUp className="h-4 w-4" />
                Enroll in Learning Path
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/employee/gap-analysis">
                View Gap Analysis
              </Link>
            </Button>
          </>
        )}
        <Button variant="outline" asChild>
          <Link to={`/employee/competency/${code}/self-assess`}>
            Take Self-Assessment
          </Link>
        </Button>
      </div>
    </div>
  );
}
