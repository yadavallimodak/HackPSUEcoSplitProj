import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReceiptCard from '@/components/receipt-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';

const ReceiptHistoryPage = () => {
  const { toast } = useToast();
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch receipts
  const { data: receipts, isLoading } = useQuery({
    queryKey: ['/api/receipts'],
  });

  // Filter receipts by date
  const filterReceipts = (receipts: any[] = []) => {
    if (dateFilter === 'all') return receipts;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (dateFilter) {
      case '7days':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      default:
        return receipts;
    }
    
    return receipts.filter(receipt => new Date(receipt.date) >= cutoffDate);
  };

  const filteredReceipts = filterReceipts(receipts || []);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReceipts.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page changes
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // View and share handlers
  const handleViewReceipt = (id: number) => {
    // In a real app, this might open a modal or navigate to a detail page
    toast({
      title: "Viewing Receipt",
      description: `Viewing details for receipt #${id}`,
    });
  };

  const handleShareReceipt = (id: number) => {
    // In a real app, this might open a share dialog
    toast({
      title: "Share Receipt",
      description: `Sharing receipt #${id}`,
    });
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Receipt History</h1>
          <div>
            <select 
              className="text-sm border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-6 flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredReceipts.length > 0 ? (
          <div className="mt-6 space-y-4">
            {currentItems.map((receipt: any) => (
              <ReceiptCard
                key={receipt.id}
                id={receipt.id}
                amount={receipt.amount}
                date={formatDate(receipt.date)}
                items={receipt.items || []}
                onView={() => handleViewReceipt(receipt.id)}
                onShare={() => handleShareReceipt(receipt.id)}
              />
            ))}

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between rounded-lg shadow-sm">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  variant="outline"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredReceipts.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredReceipts.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <Button
                      variant="outline"
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      onClick={prevPage}
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    
                    {/* Page buttons */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === page 
                            ? "bg-primary text-white" 
                            : "border-gray-300 bg-white text-gray-700"
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 bg-white shadow-sm rounded-lg p-12 text-center">
            <p className="text-gray-500 mb-4">No receipts found for the selected time period.</p>
            <Button 
              onClick={() => window.location.href = '/upload'}
            >
              Upload Your First Receipt
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptHistoryPage;
