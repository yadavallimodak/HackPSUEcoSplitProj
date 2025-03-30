import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FileUpload from '@/components/file-upload';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { formatDate, formatCurrency } from '@/lib/utils';
import { FileText, Upload, AlertCircle, Clock, CheckCircle, Info, Leaf, Camera, BarChart2, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

type RecentUpload = {
  id: number;
  filename: string;
  date: string;
  amount: number;
  status: 'processing' | 'processed' | 'failed';
  ecoImpact?: {
    score: number;
    details: {
      category: string;
      icon: string;
      isEcoFriendly: boolean;
      impact: string;
    }[]
  }
};

// Ensure status is one of the allowed values
const validStatus = (status: string): 'processing' | 'processed' | 'failed' => {
  if (status === 'processing' || status === 'processed' || status === 'failed') {
    return status;
  }
  return 'processed';
};

const UploadReceiptPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upload');
  const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);
  const [selectedUpload, setSelectedUpload] = useState<RecentUpload | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // In a real implementation, this would use FormData and upload to the server
      // For this demo, we'll simulate a successful upload with progress updates
      
      // Simulate upload progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(progressInterval);
        }
      }, 300);
      
      // Simulate server processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      return {
        id: Math.floor(Math.random() * 1000),
        filename: file.name,
        date: new Date().toISOString(),
        amount: Math.floor(Math.random() * 10000) / 100,
        status: validStatus('processed'),
        ecoImpact: {
          score: Math.floor(Math.random() * 40) + 60, // Score between 60-100
          details: [
            {
              category: 'Groceries',
              icon: 'ShoppingBag',
              isEcoFriendly: true,
              impact: 'Locally sourced produce has a lower carbon footprint'
            },
            {
              category: 'Packaging',
              icon: 'Package',
              isEcoFriendly: Math.random() > 0.5,
              impact: Math.random() > 0.5 ? 'Recyclable packaging reduces waste' : 'Consider reusable alternatives to reduce waste'
            },
            {
              category: 'Travel',
              icon: 'Car',
              isEcoFriendly: Math.random() > 0.7,
              impact: Math.random() > 0.7 ? 'Walking to the store saved carbon emissions' : 'Consider cycling or walking for short distances'
            }
          ]
        }
      };
    },
    onSuccess: (data) => {
      // Add to recent uploads
      setRecentUploads([data, ...recentUploads]);
      setSelectedUpload(data);
      setActiveTab('results');
      setUploadProgress(0);
      
      // Show success message
      toast({
        title: 'Receipt uploaded successfully',
        description: 'Your receipt has been processed and scored',
      });
      
      // Invalidate receipts query to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/receipts'] });
    },
    onError: (error) => {
      setUploadProgress(0);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your receipt',
        variant: 'destructive',
      });
    }
  });

  const handleFileUpload = (file: File) => {
    uploadMutation.mutate(file);
  };

  const renderUploadStatus = () => {
    if (uploadMutation.isPending) {
      return (
        <Alert className="mt-4 bg-blue-50 border-blue-200">
          <Clock className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700">
            Uploading and processing your receipt...
            <Progress value={uploadProgress} className="mt-2 h-2" />
          </AlertDescription>
        </Alert>
      );
    }
    
    if (uploadMutation.isError) {
      return (
        <Alert className="mt-4 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            Error uploading your receipt. Please try again.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  };

  const renderUploadResults = () => {
    if (!selectedUpload) return null;
    
    return (
      <div className="space-y-4">
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-800" />
              </div>
              <div>
                <h3 className="font-medium text-green-800">Receipt Successfully Processed</h3>
                <p className="text-sm text-green-600">{selectedUpload.filename}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{formatDate(selectedUpload.date)}</p>
              <p className="text-xl font-bold text-gray-800">{formatCurrency(selectedUpload.amount * 100)}</p>
            </div>
          </div>
        </div>
        
        {selectedUpload.ecoImpact && (
          <>
            <Card>
              <CardHeader className="bg-green-50 border-b border-green-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-green-800 flex items-center">
                    <Leaf className="mr-2 h-5 w-5" /> 
                    GreenScore Analysis
                  </CardTitle>
                  <div className="bg-white rounded-full h-14 w-14 flex items-center justify-center border-2 border-green-500">
                    <span className="text-lg font-bold text-green-800">{selectedUpload.ecoImpact.score}</span>
                  </div>
                </div>
                <CardDescription className="text-green-700">
                  How eco-friendly are your purchases?
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-medium text-gray-800">Impact Details</h3>
                
                {selectedUpload.ecoImpact.details.map((detail, index) => (
                  <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <div className={`rounded-full p-2 ${detail.isEcoFriendly ? 'bg-green-100' : 'bg-yellow-100'} mr-3`}>
                      {detail.icon === 'ShoppingBag' ? (
                        <ShoppingBag className={`h-5 w-5 ${detail.isEcoFriendly ? 'text-green-600' : 'text-yellow-600'}`} />
                      ) : detail.icon === 'Package' ? (
                        <FileText className={`h-5 w-5 ${detail.isEcoFriendly ? 'text-green-600' : 'text-yellow-600'}`} />
                      ) : (
                        <BarChart2 className={`h-5 w-5 ${detail.isEcoFriendly ? 'text-green-600' : 'text-yellow-600'}`} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-800">{detail.category}</h4>
                        <Badge variant={detail.isEcoFriendly ? "default" : "outline"} className={`ml-2 ${detail.isEcoFriendly ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'border-yellow-300 text-yellow-700'}`}>
                          {detail.isEcoFriendly ? 'Eco-friendly' : 'Improvement Possible'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{detail.impact}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="bg-gray-50 border-t justify-between">
                <p className="text-sm text-gray-600">Continue making eco-friendly choices to improve your score!</p>
                <Button variant="outline" className="border-green-800 text-green-800 hover:bg-green-50" onClick={() => setActiveTab('upload')}>
                  Upload Another
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Upload Receipt</h1>
          <Badge className="bg-green-800 hover:bg-green-800">
            Beta Feature
          </Badge>
        </div>
        <p className="mt-2 text-gray-600">Upload your receipts to track expenses and measure your environmental impact</p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-2 bg-green-50">
            <TabsTrigger value="upload" className="data-[state=active]:bg-green-800 data-[state=active]:text-white">Upload Receipt</TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-green-800 data-[state=active]:text-white">Analysis Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Receipt</CardTitle>
                <CardDescription>
                  We'll analyze your purchases for both financial and environmental insights.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFileSelect={handleFileUpload}
                  className="w-full"
                />
                
                {renderUploadStatus()}

                <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-blue-800">Tips for best results</h3>
                      <ul className="mt-2 text-sm text-blue-700 space-y-1 list-disc pl-5">
                        <li>Ensure all items are clearly visible</li>
                        <li>Include store name and purchase date</li>
                        <li>Flatten wrinkled receipts</li>
                        <li>Avoid shadows or glare when taking photos</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {recentUploads.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Uploads</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200">
                    {recentUploads.slice(0, 5).map((upload) => (
                      <div key={upload.id} className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer" onClick={() => {
                        setSelectedUpload(upload);
                        setActiveTab('results');
                      }}>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-md flex items-center justify-center">
                            <FileText className="h-5 w-5 text-green-800" />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-900">{upload.filename}</h3>
                            <p className="text-sm text-gray-500">{formatDate(upload.date)} • {formatCurrency(upload.amount * 100)}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {upload.ecoImpact && (
                            <div className="mr-3 bg-green-100 px-2 py-1 rounded-full flex items-center">
                              <Leaf className="h-3.5 w-3.5 text-green-800 mr-1" />
                              <span className="text-xs font-medium text-green-800">{upload.ecoImpact.score}</span>
                            </div>
                          )}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            upload.status === 'processed' 
                              ? 'bg-green-100 text-green-800' 
                              : upload.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                {recentUploads.length > 5 && (
                  <CardFooter className="bg-gray-50 border-t py-2">
                    <Button variant="link" className="text-green-800 hover:text-green-700 w-full">
                      View All Receipts
                    </Button>
                  </CardFooter>
                )}
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="results" className="mt-4">
            {renderUploadResults()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UploadReceiptPage;
