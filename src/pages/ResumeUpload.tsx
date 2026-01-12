import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  Loader2,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { commonSkills } from '@/data/mockData';

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload a PDF or Word document.',
          variant: 'destructive',
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Please upload a file smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }
      
      setFile(selectedFile);
      setExtractedSkills([]);
      setAnalysisComplete(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const fakeEvent = { target: { files: [droppedFile] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsUploading(false);
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock skill extraction - randomly select some skills
    const shuffled = [...commonSkills].sort(() => 0.5 - Math.random());
    const randomSkills = shuffled.slice(0, Math.floor(Math.random() * 6) + 5);
    
    setExtractedSkills(randomSkills);
    setIsAnalyzing(false);
    setAnalysisComplete(true);
    
    toast({
      title: 'Analysis Complete!',
      description: `Found ${randomSkills.length} skills in your resume.`,
    });
  };

  const removeSkill = (skill: string) => {
    setExtractedSkills(prev => prev.filter(s => s !== skill));
  };

  const handleViewMatches = () => {
    navigate('/matches');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Upload Resume</h1>
          <p className="text-muted-foreground">
            Upload your resume to analyze skills and find matching jobs.
          </p>
        </div>

        {/* Upload Card */}
        <Card className="mb-6 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Resume File
            </CardTitle>
            <CardDescription>
              Supported formats: PDF, DOC, DOCX (Max 5MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!file ? (
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Drop your resume here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                <Button variant="secondary">Select File</Button>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setFile(null);
                    setExtractedSkills([]);
                    setAnalysisComplete(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Button */}
        {file && !analysisComplete && (
          <div className="mb-6 animate-fade-in">
            <Button 
              className="w-full gap-2" 
              size="lg"
              onClick={handleUpload}
              disabled={isUploading || isAnalyzing}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : isAnalyzing ? (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  Analyzing skills...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload & Analyze Resume
                </>
              )}
            </Button>
          </div>
        )}

        {/* Analysis Results */}
        {analysisComplete && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Skills Extracted
              </CardTitle>
              <CardDescription>
                We found {extractedSkills.length} skills in your resume. Click on a skill to remove it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-6">
                {extractedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-3 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => removeSkill(skill)}
                  >
                    {skill}
                    <X className="h-3 w-3 ml-2" />
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-4">
                <Button onClick={handleViewMatches} className="flex-1 gap-2">
                  <Sparkles className="h-4 w-4" />
                  Find Matching Jobs
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFile(null);
                    setExtractedSkills([]);
                    setAnalysisComplete(false);
                  }}
                >
                  Upload Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips Card */}
        <Card className="mt-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="text-lg">Tips for Better Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                Include specific technical skills (e.g., "React" instead of "JavaScript frameworks")
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                List certifications and tools you're proficient with
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                Use industry-standard terminology for skills
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                Keep your resume updated with recent technologies
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
