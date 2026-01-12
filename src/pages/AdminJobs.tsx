import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Briefcase,
  X,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockJobs, commonSkills } from '@/data/mockData';
import { Job } from '@/services/jobService';

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    salary: '',
    type: 'FULL_TIME' as Job['type'],
    requiredSkills: [] as string[],
  });
  const [skillInput, setSkillInput] = useState('');

  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      description: '',
      salary: '',
      type: 'FULL_TIME',
      requiredSkills: [],
    });
    setSkillInput('');
    setEditingJob(null);
  };

  const openDialog = (job?: Job) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        salary: job.salary || '',
        type: job.type,
        requiredSkills: [...job.requiredSkills],
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skill),
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title || !formData.company || !formData.location || !formData.description) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.requiredSkills.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one required skill.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (editingJob) {
      // Update existing job
      setJobs(prev => prev.map(job => 
        job.id === editingJob.id 
          ? { ...job, ...formData }
          : job
      ));
      toast({
        title: 'Job Updated',
        description: `"${formData.title}" has been updated successfully.`,
      });
    } else {
      // Create new job
      const newJob: Job = {
        id: String(Date.now()),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: 'admin',
      };
      setJobs(prev => [newJob, ...prev]);
      toast({
        title: 'Job Created',
        description: `"${formData.title}" has been added successfully.`,
      });
    }

    setIsLoading(false);
    closeDialog();
  };

  const handleDelete = async (job: Job) => {
    if (!confirm(`Are you sure you want to delete "${job.title}"?`)) return;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    setJobs(prev => prev.filter(j => j.id !== job.id));
    toast({
      title: 'Job Deleted',
      description: `"${job.title}" has been removed.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Jobs</h1>
            <p className="text-muted-foreground">
              Add, edit, or remove job listings for the platform.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingJob ? 'Edit Job' : 'Add New Job'}</DialogTitle>
                <DialogDescription>
                  {editingJob 
                    ? 'Update the job listing details below.'
                    : 'Fill in the details to create a new job listing.'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Senior React Developer"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      placeholder="e.g., TechCorp Inc."
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., San Francisco, CA (Remote)"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary (Optional)</Label>
                    <Input
                      id="salary"
                      placeholder="e.g., $120,000 - $160,000"
                      value={formData.salary}
                      onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Job Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: Job['type']) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL_TIME">Full Time</SelectItem>
                      <SelectItem value="PART_TIME">Part Time</SelectItem>
                      <SelectItem value="CONTRACT">Contract</SelectItem>
                      <SelectItem value="INTERNSHIP">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the role, responsibilities, and requirements..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Required Skills *</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a skill and press Enter"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <Button type="button" variant="secondary" onClick={addSkill}>
                      Add
                    </Button>
                  </div>
                  
                  {/* Skill suggestions */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {commonSkills.slice(0, 10).filter(s => !formData.requiredSkills.includes(s)).map(skill => (
                      <Badge 
                        key={skill} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          requiredSkills: [...prev.requiredSkills, skill],
                        }))}
                      >
                        + {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Selected skills */}
                  {formData.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 p-3 bg-muted rounded-lg">
                      {formData.requiredSkills.map(skill => (
                        <Badge key={skill} variant="secondary" className="gap-1">
                          {skill}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingJob ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingJob ? 'Update Job' : 'Create Job'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <Card key={job.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <Badge variant="outline">{job.type.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">
                      {job.company} • {job.location}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {job.requiredSkills.slice(0, 5).map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {job.requiredSkills.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.requiredSkills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="ghost" size="icon" onClick={() => openDialog(job)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(job)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {jobs.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Jobs Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first job listing.
              </p>
              <Button onClick={() => openDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Job
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
