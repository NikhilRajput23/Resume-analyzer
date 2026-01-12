import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { mockResumes, mockJobs, mockUserSkills, calculateJobMatches } from '@/data/mockData';

export default function Dashboard() {
  const { user } = useAuth();
  
  // Calculate stats
  const userResumes = mockResumes.filter(r => r.userId === user?.id || user?.role === 'ADMIN');
  const jobMatches = calculateJobMatches(mockUserSkills);
  const highMatches = jobMatches.filter(m => m.matchPercentage >= 70);
  const averageMatch = Math.round(
    jobMatches.reduce((acc, m) => acc + m.matchPercentage, 0) / jobMatches.length
  );

  const stats = [
    {
      label: 'Uploaded Resumes',
      value: userResumes.length,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Available Jobs',
      value: mockJobs.length,
      icon: Briefcase,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'High Matches (70%+)',
      value: highMatches.length,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Avg. Match Rate',
      value: `${averageMatch}%`,
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{user?.name}</span>!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your resume analysis and job matches.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="animate-slide-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload Resume
              </CardTitle>
              <CardDescription>
                Upload your resume to analyze skills and find matching jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/upload">
                <Button className="w-full gap-2">
                  Upload New Resume
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="animate-slide-in" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-accent" />
                Job Matches
              </CardTitle>
              <CardDescription>
                View jobs that match your skills and experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/matches">
                <Button variant="secondary" className="w-full gap-2">
                  View All Matches
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity / Top Matches Preview */}
        <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle>Top Job Matches</CardTitle>
            <CardDescription>Your best matching opportunities based on your skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobMatches.slice(0, 3).map((match) => (
                <div 
                  key={match.job.id} 
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{match.job.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {match.job.company} • {match.job.location}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-success" />
                        {match.matchedSkills.length} matched
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {match.job.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className={`text-2xl font-bold ${
                      match.matchPercentage >= 70 ? 'text-success' :
                      match.matchPercentage >= 50 ? 'text-warning' : 'text-muted-foreground'
                    }`}>
                      {match.matchPercentage}%
                    </div>
                    <p className="text-xs text-muted-foreground">match</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Link to="/matches">
              <Button variant="outline" className="w-full mt-4">
                View All Matches
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
