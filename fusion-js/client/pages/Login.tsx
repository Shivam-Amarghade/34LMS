import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const initSession = useAuthStore((state) => state.initSession);
  const [standaloneMode, setStandaloneMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');

  const handleSSO = () => {
    setLoading(true);
    setTimeout(() => {
      initSession({
        token: 'mock-token-' + Date.now(),
        user: {
          employeeId: 'EMP-001',
          name: 'John Doe',
          designation: 'Senior Software Engineer',
          department: 'Engineering',
          managerId: null,
          email: 'john.doe@mponline.gov.in',
        },
        role: 'EMPLOYEE',
        permissions: ['competency:view', 'course:view', 'learning:enroll'],
      });
      navigate('/employee/dashboard');
    }, 1500);
  };

  const handleStandaloneLogin = (e) => {
    e.preventDefault();
    setError(null);

    if (!employeeId || !password) {
      setError('Please enter both Employee ID and Password');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (employeeId === 'EMP-001' && password === 'demo') {
        initSession({
          token: 'mock-token-' + Date.now(),
          user: {
            employeeId,
            name: 'John Doe',
            designation: 'Senior Software Engineer',
            department: 'Engineering',
            managerId: null,
            email: 'john.doe@mponline.gov.in',
          },
          role: 'EMPLOYEE',
          permissions: ['competency:view', 'course:view', 'learning:enroll'],
        });
        navigate('/employee/dashboard');
      } else {
        setError('Invalid credentials. Try EMP-001 / demo');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-blue-50 to-background flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {!standaloneMode ? (
          // SSO Mode
          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <Zap className="h-7 w-7 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl">iEvolve</CardTitle>
              <CardDescription className="text-base mt-2">
                Your Learning &amp; Growth Platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4">
                <p className="text-sm text-foreground/80">
                  Welcome to the iEvolve Learning Management System. Powered by MPOnline Limited.
                </p>
              </div>

              <Button
                size="lg"
                onClick={handleSSO}
                disabled={loading}
                className="w-full h-11 bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    Connecting...
                  </>
                ) : (
                  <>
                    Continue with MPOnline Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setStandaloneMode(true)}
                className="w-full h-11"
              >
                Standalone Login
              </Button>

              <div className="text-center text-xs text-muted-foreground">
                <p>Secure SSO-integrated authentication</p>
                <p className="mt-1">Session timeout: 8 hours</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Standalone Mode
          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <Zap className="h-7 w-7 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Enter your iEvolve credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStandaloneLogin} className="space-y-4">
                {error && (
                  <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Employee ID
                  </label>
                  <Input
                    placeholder="EMP-001"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    disabled={loading}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="h-10"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full h-10 bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⟳</span>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStandaloneMode(false)}
                  className="w-full h-10"
                >
                  Back to SSO
                </Button>

                <div className="text-center text-xs text-muted-foreground">
                  <p>Demo: EMP-001 / demo</p>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 text-center text-xs text-white">
          <p>© 2026 MPOnline Limited. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
