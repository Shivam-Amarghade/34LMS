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
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  Shield,
  Trash2,
} from 'lucide-react';

// Mock certification data
const MOCK_CERTIFICATIONS = [
  {
    certId: 'CERT001',
    certificationName: 'AWS Certified Solutions Architect',
    certificateNumber: 'AWS-2024-001',
    issuingAuthority: 'Amazon Web Services',
    issueDate: '2024-01-15',
    expiryDate: '2026-01-15',
    doesNotExpire: false,
    linkedCompetency: 'Cloud Architecture',
    competencyLevel: 'E3',
    verificationStatus: 'APPROVED',
    submittedAt: '2024-01-10',
    reviewedAt: '2024-01-12',
    reviewedBy: 'Sarah Chen',
  },
  {
    certId: 'CERT002',
    certificationName: 'Google Cloud Associate Cloud Engineer',
    certificateNumber: 'GCP-2024-456',
    issuingAuthority: 'Google Cloud',
    issueDate: '2024-03-20',
    expiryDate: '2026-03-20',
    doesNotExpire: false,
    linkedCompetency: 'Cloud Architecture',
    competencyLevel: 'E2',
    verificationStatus: 'APPROVED',
    submittedAt: '2024-03-15',
    reviewedAt: '2024-03-18',
    reviewedBy: 'John Smith',
  },
  {
    certId: 'CERT003',
    certificationName: 'Kubernetes Administrator',
    certificateNumber: 'K8S-2024-789',
    issuingAuthority: 'Linux Foundation',
    issueDate: '2023-08-10',
    expiryDate: '2025-08-10',
    doesNotExpire: false,
    linkedCompetency: 'Container Orchestration',
    competencyLevel: 'E2',
    verificationStatus: 'APPROVED',
    submittedAt: '2023-08-05',
    reviewedAt: '2023-08-08',
    reviewedBy: 'Michael Chen',
  },
  {
    certId: 'CERT004',
    certificationName: 'Oracle Java Programmer',
    certificateNumber: 'ORACLE-2024-111',
    issuingAuthority: 'Oracle',
    issueDate: '2024-06-01',
    expiryDate: null,
    doesNotExpire: true,
    linkedCompetency: 'Java Programming',
    competencyLevel: 'E3',
    verificationStatus: 'PENDING',
    submittedAt: '2024-06-15',
    reviewedAt: null,
    reviewedBy: null,
  },
];

const getDaysUntilExpiry = (expiryDate: string | null) => {
  if (!expiryDate) return null;
  const expiry = new Date(expiryDate);
  const today = new Date();
  const daysLeft = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return daysLeft;
};

export default function MyCertifications() {
  const [viewMode, setViewMode] = useState<'all' | 'approved' | 'pending' | 'expiring'>('all');

  const certifications = MOCK_CERTIFICATIONS;

  // Filter certifications
  const filteredCerts = useMemo(() => {
    switch (viewMode) {
      case 'approved':
        return certifications.filter(c => c.verificationStatus === 'APPROVED');
      case 'pending':
        return certifications.filter(c => c.verificationStatus === 'PENDING');
      case 'expiring':
        return certifications.filter(c => {
          const days = getDaysUntilExpiry(c.expiryDate);
          return days !== null && days <= 90;
        });
      default:
        return certifications;
    }
  }, [viewMode]);

  // Summary stats
  const stats = {
    total: certifications.length,
    approved: certifications.filter(c => c.verificationStatus === 'APPROVED').length,
    pending: certifications.filter(c => c.verificationStatus === 'PENDING').length,
    expiring: certifications.filter(c => {
      const days = getDaysUntilExpiry(c.expiryDate);
      return days !== null && days <= 90;
    }).length,
  };

  const getStatusBadge = (status: string, expiryDays: number | null) => {
    if (status === 'PENDING') {
      return (
        <Badge className="bg-warning/10 text-warning">
          <Clock className="h-3 w-3 mr-1" />
          Pending Review
        </Badge>
      );
    }
    if (status === 'APPROVED') {
      if (expiryDays !== null && expiryDays <= 90) {
        return (
          <Badge className="bg-destructive/10 text-destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Expiring Soon
          </Badge>
        );
      }
      return (
        <Badge className="bg-success/10 text-success">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    }
    return (
      <Badge variant="outline">
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Certifications</h1>
          <p className="text-muted-foreground mt-2">
            Manage your professional certifications and credentials
          </p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90 w-full md:w-auto" asChild>
          <Link to="/employee/upload-certificate">
            <Plus className="h-4 w-4" />
            Upload Certificate
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">certifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-success">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.approved}</div>
            <p className="text-xs text-muted-foreground mt-1">approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-warning">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">under review</p>
          </CardContent>
        </Card>

        {stats.expiring > 0 && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-destructive">Expiring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.expiring}</div>
              <p className="text-xs text-muted-foreground mt-1">within 90 days</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="approved">Verified ({stats.approved})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="expiring" className={stats.expiring > 0 ? 'text-destructive' : ''}>
            Expiring ({stats.expiring})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={viewMode} className="space-y-4">
          {filteredCerts.length > 0 ? (
            filteredCerts.map(cert => {
              const expiryDays = getDaysUntilExpiry(cert.expiryDate);
              const isExpiringSoon = expiryDays !== null && expiryDays <= 90;

              return (
                <Card
                  key={cert.certId}
                  className={isExpiringSoon ? 'border-destructive/20 bg-destructive/5' : ''}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Award className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">{cert.certificationName}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {cert.issuingAuthority} • {cert.certificateNumber}
                          </p>
                        </div>
                        {getStatusBadge(cert.verificationStatus, expiryDays)}
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Issued */}
                        <div className="text-sm">
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Issued
                          </p>
                          <p className="font-semibold mt-1">
                            {new Date(cert.issueDate).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Expires */}
                        {cert.expiryDate && (
                          <div className="text-sm">
                            <p className={`text-muted-foreground flex items-center gap-1 ${
                              isExpiringSoon ? 'text-destructive' : ''
                            }`}>
                              <Clock className="h-3 w-3" />
                              Expires
                            </p>
                            <p className={`font-semibold mt-1 ${isExpiringSoon ? 'text-destructive' : ''}`}>
                              {new Date(cert.expiryDate).toLocaleDateString()}
                            </p>
                            {expiryDays !== null && (
                              <p className={`text-xs mt-1 ${isExpiringSoon ? 'text-destructive' : 'text-muted-foreground'}`}>
                                {expiryDays > 0 ? `${expiryDays} days left` : 'Expired'}
                              </p>
                            )}
                          </div>
                        )}

                        {cert.doesNotExpire && (
                          <div className="text-sm">
                            <p className="text-muted-foreground flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              Validity
                            </p>
                            <p className="font-semibold mt-1 text-success">Lifetime</p>
                          </div>
                        )}

                        {/* Linked Competency */}
                        {cert.linkedCompetency && (
                          <div className="text-sm">
                            <p className="text-muted-foreground">Linked Competency</p>
                            <p className="font-semibold mt-1 text-primary">{cert.linkedCompetency}</p>
                            <Badge className="mt-1 text-xs">{cert.competencyLevel}</Badge>
                          </div>
                        )}

                        {/* Status Detail */}
                        {cert.verificationStatus === 'PENDING' && (
                          <div className="text-sm">
                            <p className="text-muted-foreground">Submitted</p>
                            <p className="font-semibold mt-1">
                              {new Date(cert.submittedAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
                          </div>
                        )}

                        {cert.verificationStatus === 'APPROVED' && (
                          <div className="text-sm">
                            <p className="text-muted-foreground">Approved By</p>
                            <p className="font-semibold mt-1">{cert.reviewedBy}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(cert.reviewedAt!).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap pt-2 border-t">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/employee/certificate/${cert.certId}`}>
                            View Details
                          </Link>
                        </Button>
                        {cert.verificationStatus === 'PENDING' && (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/employee/upload-certificate?edit=${cert.certId}`}>
                              Re-upload
                            </Link>
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">No certifications found</p>
                <Button asChild>
                  <Link to="/employee/upload-certificate">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Your First Certificate
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">About Certification Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>📋 Submit your certification documents for review by the L&D team</p>
          <p>✓ Upon approval, the certification will enhance your competency profile</p>
          <p>⏰ Certifications typically reviewed within 2-3 business days</p>
          <p>🔔 You'll be notified when your certification is approved or needs revision</p>
        </CardContent>
      </Card>
    </div>
  );
}
