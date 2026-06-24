import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Input } from '@/components/ui/input';
import {
  Bell,
  BookOpen,
  Award,
  Zap,
  AlertCircle,
  CheckCircle,
  Archive,
  Trash2,
  Search,
} from 'lucide-react';

// Mock notifications data
const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    eventType: 'COURSE_ASSIGNED',
    title: 'New Course Assigned',
    description: 'Your supervisor assigned "Python Advanced Patterns" to your learning path',
    category: 'COURSES',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    deepLinkPath: '/employee/learning',
    icon: BookOpen,
  },
  {
    id: 'notif-2',
    eventType: 'BADGE_EARNED',
    title: 'Badge Earned!',
    description: 'Congratulations! You earned the "Course Master" badge',
    category: 'GAMIFICATION',
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    deepLinkPath: '/employee/gamification',
    icon: Award,
  },
  {
    id: 'notif-3',
    eventType: 'COMPETENCY_EXPIRING',
    title: 'Competency Expiring Soon',
    description: 'Your Python Programming competency expires in 20 days. Please renew it.',
    category: 'COMPETENCIES',
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    deepLinkPath: '/employee/competencies',
    icon: AlertCircle,
  },
  {
    id: 'notif-4',
    eventType: 'CERT_APPROVED',
    title: 'Certification Approved',
    description: 'Your AWS Certified Solutions Architect certification has been verified',
    category: 'CERTIFICATIONS',
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    deepLinkPath: '/employee/certifications',
    icon: CheckCircle,
  },
  {
    id: 'notif-5',
    eventType: 'LEVEL_UP',
    title: 'Level Up!',
    description: 'You reached Intermediate level! You now have 350 points.',
    category: 'GAMIFICATION',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    deepLinkPath: '/employee/gamification',
    icon: Zap,
  },
  {
    id: 'notif-6',
    eventType: 'LEARNING_PATH_COMPLETED',
    title: 'Learning Path Completed!',
    description: 'You completed the React Advanced Path and upgraded to E4 level',
    category: 'COURSES',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    deepLinkPath: '/employee/learning',
    icon: BookOpen,
  },
  {
    id: 'notif-7',
    eventType: 'ASSESSMENT_REMINDER',
    title: 'Assessment Pending',
    description: 'You have a pending Python OOP Assessment. Complete it to finish your course.',
    category: 'COURSES',
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    deepLinkPath: '/employee/learning',
    icon: BookOpen,
  },
  {
    id: 'notif-8',
    eventType: 'CERT_EXPIRING',
    title: 'Certification Expiring Soon',
    description: 'Your Kubernetes Administrator certificate expires in 60 days',
    category: 'CERTIFICATIONS',
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    deepLinkPath: '/employee/certifications',
    icon: AlertCircle,
  },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'COURSES':
      return BookOpen;
    case 'CERTIFICATIONS':
      return Award;
    case 'GAMIFICATION':
      return Zap;
    case 'COMPETENCIES':
      return AlertCircle;
    default:
      return Bell;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'COURSES':
      return 'bg-blue-100 text-blue-700';
    case 'CERTIFICATIONS':
      return 'bg-purple-100 text-purple-700';
    case 'GAMIFICATION':
      return 'bg-yellow-100 text-yellow-700';
    case 'COMPETENCIES':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export default function NotificationCenter() {
  const [filter, setFilter] = useState<'all' | 'unread' | string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsCopy, setNotificationsCopy] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notificationsCopy.filter(n => !n.isRead).length;

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notificationsCopy;

    // Filter by type
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    } else if (filter !== 'all') {
      filtered = filtered.filter(n => n.category === filter);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [notificationsCopy, filter, searchQuery]);

  const handleMarkAsRead = (id: string) => {
    setNotificationsCopy(notificationsCopy.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotificationsCopy(notificationsCopy.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotificationsCopy(notificationsCopy.filter(n => n.id !== id));
  };

  const handleArchive = (id: string) => {
    handleDelete(id);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-2">
            Stay updated with your learning activities and achievements
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Unread Summary */}
      {unreadCount > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="font-semibold">{unreadCount} Unread Notification{unreadCount !== 1 ? 's' : ''}</p>
              <p className="text-sm text-muted-foreground">You have {unreadCount} new update{unreadCount !== 1 ? 's' : ''}</p>
            </div>
            <Badge className="bg-primary text-white">{unreadCount}</Badge>
          </CardContent>
        </Card>
      )}

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread" className={unreadCount > 0 ? 'text-primary' : ''}>
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="COURSES">Courses</TabsTrigger>
            <TabsTrigger value="CERTIFICATIONS">Certs</TabsTrigger>
            <TabsTrigger value="GAMIFICATION">Games</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => {
            const IconComponent = notification.icon;
            return (
              <Card
                key={notification.id}
                className={`border-l-4 transition-colors ${
                  notification.isRead
                    ? 'border-l-muted bg-muted/20'
                    : 'border-l-primary bg-primary/5'
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getCategoryColor(notification.category)}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className={`font-semibold ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h3>
                          <p className={`text-sm mt-1 ${!notification.isRead ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                            {notification.description}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="h-3 w-3 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs ${getCategoryColor(notification.category)}`}>
                            {notification.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8"
                            asChild
                          >
                            <Link to={notification.deepLinkPath}>
                              View
                            </Link>
                          </Button>
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-muted-foreground hover:text-foreground"
                            onClick={() => handleArchive(notification.id)}
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">No notifications</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try adjusting your search' : 'You\'re all caught up!'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Preferences Info Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You can manage your notification preferences to control which types of updates you receive.
            By default, all notifications are enabled to keep you informed of your learning progress.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
