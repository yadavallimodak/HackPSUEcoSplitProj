import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus, User, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type BillSplitModalProps = {
  open: boolean;
  onClose: () => void;
  amount: number;
  receiptTitle?: string;
  date?: string;
};

type Friend = {
  id: string;
  name: string;
  amount: number;
  paid: boolean;
};

export function BillSplitModal({ open, onClose, amount, receiptTitle, date }: BillSplitModalProps) {
  const { toast } = useToast();
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: '', amount: 0, paid: false }
  ]);
  const [newFriendName, setNewFriendName] = useState('');

  // Calculate remaining amount
  const allocatedAmount = friends.reduce((sum, friend) => sum + friend.amount, 0);
  const remainingAmount = amount - allocatedAmount;

  const handleNameChange = (id: string, name: string) => {
    setFriends(friends.map(friend => 
      friend.id === id ? { ...friend, name } : friend
    ));
  };

  const handleAmountChange = (id: string, value: string) => {
    const newAmount = parseFloat(value) || 0;
    setFriends(friends.map(friend => 
      friend.id === id ? { ...friend, amount: newAmount } : friend
    ));
  };

  const handleAddFriend = () => {
    if (newFriendName.trim()) {
      setFriends([
        ...friends,
        { id: Date.now().toString(), name: newFriendName, amount: 0, paid: false }
      ]);
      setNewFriendName('');
    }
  };

  const handleRemoveFriend = (id: string) => {
    if (friends.length > 1) {
      setFriends(friends.filter(friend => friend.id !== id));
    }
  };

  const handleSplitEvenly = () => {
    const evenAmount = parseFloat((amount / (friends.length + 1)).toFixed(2));
    setFriends(friends.map(friend => ({ ...friend, amount: evenAmount })));
  };

  const handleTogglePaid = (id: string) => {
    setFriends(friends.map(friend => 
      friend.id === id ? { ...friend, paid: !friend.paid } : friend
    ));
  };

  const handleSendRequests = () => {
    // In a real app, this would send requests to your friends
    toast({
      title: "Requests sent successfully",
      description: `Split requests sent to ${friends.filter(f => f.name).length} friends.`,
    });

    // Close the modal
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Split Bill
          </DialogTitle>
          <DialogDescription>
            {receiptTitle && <span className="font-medium text-gray-700">{receiptTitle}</span>}
            {date && <span className="text-gray-500 ml-2">{date}</span>}
            <div className="mt-1 text-lg font-bold text-green-800">
              Total: {formatCurrency(amount * 100)}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">Friends</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="text-green-800 border-green-800 hover:bg-green-50"
              onClick={handleSplitEvenly}
            >
              Split Evenly
            </Button>
          </div>

          {/* Friends list */}
          <div className="space-y-3">
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-green-800" />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Friend's name"
                    value={friend.name}
                    onChange={(e) => handleNameChange(friend.id, e.target.value)}
                    className="border-gray-300 focus-visible:ring-green-500"
                  />
                </div>
                <div className="w-32">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={friend.amount || ''}
                      onChange={(e) => handleAmountChange(friend.id, e.target.value)}
                      className="pl-8 border-gray-300 focus-visible:ring-green-500"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleTogglePaid(friend.id)}
                  className={friend.paid ? "text-green-800 bg-green-50" : "text-gray-400"}
                >
                  {friend.paid ? "Paid" : "Unpaid"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFriend(friend.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Remaining amount indicator */}
          <div className={`text-right font-medium ${remainingAmount < 0 ? 'text-red-500' : remainingAmount > 0 ? 'text-orange-500' : 'text-green-600'}`}>
            {remainingAmount !== 0 && 
              `${remainingAmount > 0 ? 'Remaining' : 'Overspent'}: ${formatCurrency(Math.abs(remainingAmount) * 100)}`
            }
            {remainingAmount === 0 && 'All expenses allocated'}
          </div>

          {/* Add friend input */}
          <div className="flex space-x-2 mt-2">
            <div className="flex-1">
              <Input
                placeholder="Add a friend by name or email"
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                className="border-gray-300 focus-visible:ring-green-500"
              />
            </div>
            <Button
              type="button"
              onClick={handleAddFriend}
              disabled={!newFriendName.trim()}
              className="bg-green-800 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          {/* Your share */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-100 mt-6">
            <h3 className="font-medium text-green-800 mb-2">Your Share</h3>
            <div className="flex justify-between items-center">
              <div className="text-gray-700">Your contribution:</div>
              <div className="text-xl font-bold text-green-800">{formatCurrency((amount - allocatedAmount) * 100)}</div>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              This amount includes your contribution plus any unallocated expenses.
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendRequests}
            className="bg-green-800 hover:bg-green-700"
            disabled={allocatedAmount === 0 || remainingAmount < 0}
          >
            Send Split Requests
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}