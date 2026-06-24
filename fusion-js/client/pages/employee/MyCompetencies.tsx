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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Search, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';

const COMPETENCY_TYPES = ['All Types', 'Technical', 'Soft Skill', 'Managerial', 'Domain', 'Functional'];
const STATUS_OPTIONS = ['All Status', 'Active', 'Expiring', 'Expired'];

export default function MyCompetencies() {
  const competencies = useCompetencyStore((state) => state.profile.data);
  const [view, setView] = useState<'all' | 'primary' | 'secondary'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  // Filter competencies
  const filteredCompetencies = useMemo(() => {
    return competencies.filter(comp => {
      // View filter
      if (view === 'primary' && !comp.isPrimary) return false;
      if (view === 'secondary' && comp.isPrimary) return false;

      // Search filter
      if (searchQuery && !comp.competencyName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Type filter
      if (selectedType !== 'All Types') {
        // Mock type based on name for demo
        const typeMap: Record<string, string> = {
          'Python': 'Technical',
          'React': 'Technical',
          'System Design': 'Technical',
          'Communication': 'Soft Skill',
        };
        const compType = typeMap[comp.competencyName] || 'Technical';
        if (compType !== selectedType) return false;
      }

      // Status filter
      if (selectedStatus !== 'All Status' && comp.status !== selectedStatus.toUpperCase()) {
        return false;
      }

      return true;
    });
  }, [competencies, view, searchQuery, selectedType, selectedStatus]);

  // Summary stats
  const allStats = useMemo(() => ({
    total: competencies.length,
    primary: competencies.filter(c => c.isPrimary).length,
    secondary: competencies.filter(c => !c.isPrimary).length,
    atTarget: competencies.filter(c => c.gap === 0).length,
    belowTarget: competencies.filter(c => c.gap > 0).length,
    expiring: competencies.filter(c => c.status === 'EXPIRING').length,
  }), [competencies]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-success/10 text-success border-success/20';
      case 'EXPIRING':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'EXPIRED':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getLevelColor = (level: string) => {
    const levelMap: Record<string, string> = {
      'E0': 'bg-gray-100 text-gray-700',
      'E1': 'bg-blue-100 text-blue-700',
      'E2': 'bg-cyan-100 text-cyan-700',
      'E3': 'bg-orange-100 text-orange-700',
      'E4': 'bg-green-100 text-green-700',
    };
    return levelMap[level] || 'bg-gray-100';
  };

  const getGapBarColor = (gap: number) => {
    if (gap === 0) return 'bg-success';
    if (gap === 1) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Competencies</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your assigned competencies and development goals
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{allStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Primary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{allStats.primary}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Secondary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{allStats.secondary}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-success">At Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{allStats.atTarget}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-warning">Below Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{allStats.belowTarget}</div>
          </CardContent>
        </Card>

        {allStats.expiring > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-warning">Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{allStats.expiring}</div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Tabs & Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <CardTitle>Competencies</CardTitle>
              <Button className="gap-2 bg-primary hover:bg-primary/90" asChild>
                <Link to="/employee/self-assign">
                  <Plus className="h-4 w-4" />
                  Add Competency
                </Link>
              </Button>
            </div>

            {/* View Tabs */}
            <div className="flex gap-2 border-b border-border">
              <button
                onClick={() => setView('all')}
                className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                  view === 'all'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                All Competencies
              </button>
              <button
                onClick={() => setView('primary')}
                className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                  view === 'primary'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Primary ({allStats.primary})
              </button>
              <button
                onClick={() => setView('secondary')}
                className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                  view === 'secondary'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Secondary ({allStats.secondary})
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search competencies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPETENCY_TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(status => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        {/* Competencies Table */}
        <CardContent>
          {filteredCompetencies.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Competency Name</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Level</TableHead>
                    <TableHead className="hidden lg:table-cell">Gap</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompetencies.map(comp => (
                    <TableRow key={comp.competencyCode} className="hover:bg-muted/50">
                      {/* Competency Info */}
                      <TableCell className="font-medium">
                        <div className="space-y-1">
                          <p>{comp.competencyName}</p>
                          <div className="flex gap-2 flex-wrap md:hidden">
                            <Badge variant="outline" className="text-xs">
                              {comp.isPrimary ? 'Primary' : 'Secondary'}
                            </Badge>
                            <Badge className={getLevelColor(comp.currentLevel)}>
                              {comp.currentLevel}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>

                      {/* Type */}
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">
                          {comp.competencyCode.includes('COMP') ? 'Technical' : 'Soft Skill'}
                        </Badge>
                      </TableCell>

                      {/* Current → Target Level */}
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Badge className={getLevelColor(comp.currentLevel)}>
                            {comp.currentLevel}
                          </Badge>
                          <span className="text-muted-foreground">→</span>
                          <Badge variant="outline">{comp.targetLevel}</Badge>
                          {comp.isPrimary && <Badge className="bg-primary/10 text-primary">Primary</Badge>}
                        </div>
                      </TableCell>

                      {/* Gap Visualization */}
                      <TableCell className="hidden lg:table-cell">
                        {comp.gap > 0 ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Progress value={(4 - comp.gap) * 25} className="h-2 w-16" />
                              <span className="text-sm font-medium text-foreground">
                                {comp.gap}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              levels to target
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-sm text-success font-medium">At Target</span>
                          </div>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="hidden md:table-cell">
                        <Badge className={getStatusColor(comp.status)}>
                          {comp.status === 'EXPIRING' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {comp.status.charAt(0) + comp.status.slice(1).toLowerCase()}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="gap-1"
                        >
                          <Link to={`/employee/competency/${comp.competencyCode}`}>
                            View
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No competencies found</p>
              <Button asChild>
                <Link to="/employee/self-assign">Add Your First Competency</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Next Steps</CardTitle>
            <CardDescription>Focus on closing your gaps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {competencies.filter(c => c.gap > 0).slice(0, 3).map(comp => (
              <div key={comp.competencyCode} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{comp.competencyName}</p>
                  <p className="text-xs text-muted-foreground">
                    {comp.currentLevel} → {comp.targetLevel}
                  </p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/employee/gap-analysis">Enroll</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Expiring Soon */}
        {allStats.expiring > 0 && (
          <Card className="border-warning/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                Re-validation Required
              </CardTitle>
              <CardDescription>Competencies expiring soon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {competencies.filter(c => c.status === 'EXPIRING').map(comp => (
                <div key={comp.competencyCode} className="flex items-center justify-between p-3 rounded-lg bg-warning/5">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{comp.competencyName}</p>
                    <p className="text-xs text-muted-foreground">Expires in 20 days</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/employee/certifications">Renew</Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
