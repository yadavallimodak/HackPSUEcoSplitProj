import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GreenScoreCircle from '@/components/greenscore-circle';
import FileUpload from '@/components/file-upload';
import { BillSplitModal } from '@/components/bill-split-modal';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Leaf, Package, CloudCog, Upload, ChevronRight, Split, Users } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isBillSplitModalOpen, setIsBillSplitModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  // Fetch green score
  const { data: greenScore, isLoading: isLoadingGreenScore } = useQuery<{ score: number }>({
    queryKey: ['/api/greenscores/me'],
    enabled: !!user,
  });
  
  // Fetch receipts
  const { data: receipts, isLoading: isLoadingReceipts } = useQuery<any[]>({
    queryKey: ['/api/receipts'],
    enabled: !!user,
  });

  const handleFileUpload = async (file: File) => {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('receipt', file);
      
      // Here we'd normally have an API endpoint to handle file uploads
      // For this demo we'll just show a success toast
      toast({
        title: 'Receipt uploaded successfully',
        description: 'Your receipt is being processed',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your receipt',
        variant: 'destructive',
      });
    }
  };

  const handleOpenBillSplit = (receipt: any) => {
    setSelectedReceipt(receipt);
    setIsBillSplitModalOpen(true);
  };

  const closeBillSplitModal = () => {
    setIsBillSplitModalOpen(false);
  };

  // Recent activities from the receipts data
  const recentActivity = Array.isArray(receipts) ? receipts.slice(0, 4) : [];
  
  // If there's no receipt data yet, create some mock data for the demo
  const mockReceipts = [
    {
      id: 1,
      title: 'Whole Foods Market',
      date: new Date().toISOString(),
      amount: 78.45,
      items: [
        { name: 'Organic Produce', isEcoFriendly: true },
        { name: 'Reusable Bags', isEcoFriendly: true },
        { name: 'Local Dairy', isEcoFriendly: true }
      ]
    },
    {
      id: 2,
      title: 'Target',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 120.99,
      items: [
        { name: 'Household Items', isEcoFriendly: false },
        { name: 'Eco Cleaning Products', isEcoFriendly: true }
      ]
    },
    {
      id: 3,
      title: 'Local Farmers Market',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 45.50,
      items: [
        { name: 'Seasonal Vegetables', isEcoFriendly: true },
        { name: 'Artisan Bread', isEcoFriendly: true }
      ]
    }
  ];
  
  // Use mock data if no real data available
  const displayReceipts = recentActivity.length > 0 ? recentActivity : mockReceipts;

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        {/* Bill Split Modal */}
        {selectedReceipt && (
          <BillSplitModal
            open={isBillSplitModalOpen}
            onClose={closeBillSplitModal}
            amount={selectedReceipt.amount}
            receiptTitle={selectedReceipt.title}
            date={formatDate(selectedReceipt.date)}
          />
        )}
        
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* GreenScore Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your GreenScore</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-green-800 hover:text-green-700 hover:bg-green-50"
                onClick={() => window.location.href = '/upload'}
              >
                Upload Another
              </Button>
            </CardHeader>
            <CardContent className="flex justify-center py-6 bg-green-50 bg-opacity-30">
              {isLoadingGreenScore ? (
                <div className="h-40 w-40 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <GreenScoreCircle score={greenScore?.score ?? 78} />
              )}
            </CardContent>
            <CardContent className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Eco Impact by Category</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Leaf className="h-5 w-5 text-primary mr-2" />
                    <span>Food Sourcing</span>
                  </div>
                  <span className="text-primary font-medium">Eco-friendly</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-primary mr-2" />
                    <span>Packaging</span>
                  </div>
                  <span className="text-orange-500 font-medium">Needs Improvement</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CloudCog className="h-5 w-5 text-primary mr-2" />
                    <span>Carbon Impact</span>
                  </div>
                  <span className="text-gray-500 font-medium">Moderate</span>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="text-primary text-opacity-50 mr-1">"</span>
                  Try skipping the bottled water next time — reusable bottles are cheaper and greener!
                </p>
              </div>
              <Button 
                className="w-full bg-green-800 hover:bg-green-700"
                onClick={() => window.location.href = '/leaderboard'}
              >
                Compare on Leaderboard
              </Button>
              <p className="text-xs text-center text-gray-500">Your score ranks in the top 20% of users this week!</p>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <div>
                <select className="text-sm border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary">
                  <option>All Dates</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                </select>
              </div>
            </CardHeader>
            <div className="divide-y divide-gray-200">
              {isLoadingReceipts ? (
                <div className="py-20 flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : displayReceipts.length > 0 ? (
                displayReceipts.map((receipt: any) => (
                  <div key={receipt.id} className="px-6 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{receipt.title || 'RECEIPT'}</div>
                        <div className="text-sm text-gray-500">{formatDate(receipt.date)}</div>
                      </div>
                      <div className="text-lg font-medium text-gray-900">{formatCurrency(receipt.amount * 100)}</div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      {receipt.items?.map((i: any) => (
                        <span key={i.name} className="mr-2 flex items-center">
                          <span className={`w-2 h-2 rounded-full ${i.isEcoFriendly ? 'bg-green-500' : 'bg-gray-400'} mr-1`}></span>
                          {i.name}
                        </span>
                      )) || 'Mixed Items'}
                    </div>
                    <div className="flex justify-end space-x-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-green-800 border-green-800 hover:bg-green-50"
                        onClick={() => handleOpenBillSplit(receipt)}
                      >
                        <Users className="h-4 w-4 mr-1" /> Split Bill
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500">No receipts found. Upload your first receipt!</p>
                </div>
              )}
            </div>
            <CardFooter className="bg-gray-50 px-6 py-3 flex justify-between">
              <Link href="/receipts" className="text-green-800 hover:text-green-700 font-medium flex items-center">
                View All Receipts
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
              <Button 
                onClick={() => {
                  if (displayReceipts.length > 0) {
                    handleOpenBillSplit(displayReceipts[0]);
                  } else {
                    toast({ title: "No receipts", description: "Upload a receipt first to split bills." });
                  }
                }}
                className="bg-green-800 hover:bg-green-700"
                size="sm"
              >
                <Users className="h-4 w-4 mr-1" /> Split A Bill
              </Button>
            </CardFooter>
          </Card>

          {/* Upload Receipt */}
          <Card className="lg:col-span-3">
            <CardHeader className="border-b border-gray-200">
              <CardTitle>Upload Receipt</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center">
              <FileUpload
                onFileSelect={handleFileUpload}
                className="w-full max-w-md"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
