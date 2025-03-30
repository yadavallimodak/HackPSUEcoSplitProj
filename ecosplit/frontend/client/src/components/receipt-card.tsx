import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Share2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

type ReceiptItemProps = {
  name: string;
  ecoFriendly: boolean;
};

type ReceiptCardProps = {
  id: number;
  amount: number;
  date: string;
  items: ReceiptItemProps[];
  onView?: () => void;
  onShare?: () => void;
};

const ReceiptCard: React.FC<ReceiptCardProps> = ({ 
  id, 
  amount, 
  date, 
  items = [],
  onView,
  onShare
}) => {
  // Generate categories from receipt items
  const categories = [...new Set(items.map(item => item.name))];
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 mb-1">RECEIPT</h3>
            <div className="text-sm text-gray-500">{categories.join(' • ')}</div>
            <div className="flex mt-2 flex-wrap gap-2">
              {categories.map((category, index) => {
                const isEco = items.some(item => 
                  item.name === category && item.ecoFriendly
                );
                
                return (
                  <Badge 
                    key={index} 
                    variant={isEco ? "default" : "destructive"}
                    className={isEco ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"}
                  >
                    {category}
                  </Badge>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-2xl font-medium text-gray-900">{formatCurrency(amount)}</div>
            <div className="text-sm text-gray-500">{date}</div>
            <div className="flex mt-2 space-x-2">
              {onShare && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:text-primary-dark hover:bg-gray-100"
                  onClick={onShare}
                >
                  <Share2 className="h-4 w-4 mr-1" /> Share
                </Button>
              )}
              {onView && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:text-primary-dark hover:bg-gray-100"
                  onClick={onView}
                >
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiptCard;
