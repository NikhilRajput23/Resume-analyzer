import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Briefcase, 
  MapPin, 
  IndianRupee,
    Clock, 
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ExternalLink
} from 'lucide-react';
import { calculateJobMatches, mockUserSkills } from '@/data/mockData';
import { JobMatch } from '@/services/jobService';

export default function JobMatches() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [minMatch, setMinMatch] = useState<string>('0');
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const allMatches = calculateJobMatches(mockUserSkills);

  const filteredMatches = allMatches.filter((match) => {
    const matchesSearch = 
      match.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || match.job.type === typeFilter;
    const matchesMinMatch = match.matchPercentage >= parseInt(minMatch);

    return matchesSearch && matchesType && matchesMinMatch;
  });

  const getMatchColor = (percentage: number) => {
    if (percentage >= 70) return 'text-success';
    if (percentage >= 50) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getMatchBgColor = (percentage: number) => {
    if (percentage >= 70) return 'bg-success';
    if (percentage >= 50) return 'bg-warning';
    return 'bg-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Job Matches</h1>
          <p className="text-muted-foreground">
            Based on your resume skills: {mockUserSkills.slice(0, 5).join(', ')}
            {mockUserSkills.length > 5 && ` +${mockUserSkills.length - 5} more`}
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6 animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs, companies, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-4">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={minMatch} onValueChange={setMinMatch}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Min Match" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Matches</SelectItem>
                    <SelectItem value="50">50%+</SelectItem>
                    <SelectItem value="70">70%+</SelectItem>
                    <SelectItem value="80">80%+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredMatches.length} of {allMatches.length} jobs
        </p>

        {/* Job Cards */}
        <div className="space-y-4">
          {filteredMatches.map((match, index) => (
            <Card 
              key={match.job.id} 
              className="animate-fade-in hover:shadow-lg transition-shadow"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold">{match.job.title}</h3>
                        <p className="text-muted-foreground">{match.job.company}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getMatchColor(match.matchPercentage)}`}>
                          {match.matchPercentage}%
                        </div>
                        <p className="text-xs text-muted-foreground">match</p>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {match.job.location}
                      </span>
                      {match.job.salary && (
                        <span className="flex items-center gap-1">
                <IndianRupee className="h-4 w-4" />
                          {match.job.salary}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {match.job.type.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Match Progress Bar */}
                    <div className="mb-4">
                      <Progress 
                        value={match.matchPercentage} 
                        className="h-2"
                      />
                    </div>

                    {/* Skills Preview */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {match.matchedSkills.slice(0, 4).map(skill => (
                        <Badge key={skill} variant="default" className="bg-success/20 text-success border-0">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                      {match.missingSkills.slice(0, 2).map(skill => (
                        <Badge key={skill} variant="secondary">
                          <XCircle className="h-3 w-3 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                      {(match.matchedSkills.length + match.missingSkills.length > 6) && (
                        <Badge variant="outline">
                          +{match.matchedSkills.length + match.missingSkills.length - 6} more
                        </Badge>
                      )}
                    </div>

                    {/* Expanded Details */}
                    {expandedJob === match.job.id && (
                      <div className="border-t pt-4 mt-4 animate-fade-in">
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground mb-4">{match.job.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-success" />
                              Matched Skills ({match.matchedSkills.length})
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {match.matchedSkills.map(skill => (
                                <Badge key={skill} variant="default" className="bg-success/20 text-success border-0">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-destructive" />
                              Missing Skills ({match.missingSkills.length})
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {match.missingSkills.map(skill => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedJob(expandedJob === match.job.id ? null : match.job.id)}
                      >
                        {expandedJob === match.job.id ? 'Show Less' : 'View Details'}
                      </Button>
                      <Button size="sm" className="gap-2">
                        Apply Now
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredMatches.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Matching Jobs Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or upload a new resume with more skills.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
