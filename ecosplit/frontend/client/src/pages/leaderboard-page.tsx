import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { 
  Leaf, 
  ShoppingBag, 
  Droplet, 
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type GreenScore = {
  id: number;
  userId: number;
  username: string;
  score: number;
  week: number;
  year: number;
};

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');

  // Fetch leaderboard data
  const { data: leaderboardData, isLoading } = useQuery<GreenScore[]>({
    queryKey: ['/api/greenscores'],
    enabled: !!user,
  });

  // Fetch user's green score
  const { data: userGreenScore } = useQuery<{ score: number }>({
    queryKey: ['/api/greenscores/me'],
    enabled: !!user,
  });

  // Calculate user's position
  const getUserPosition = () => {
    if (!leaderboardData || !userGreenScore) return null;
    
    const position = leaderboardData.findIndex(item => item.userId === user?.id) + 1;
    return position > 0 ? position : leaderboardData.length + 1;
  };

  // Get initials from username
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Format position with st, nd, rd, th suffix
  const formatPosition = (position: number) => {
    if (position === 1) return '1st';
    if (position === 2) return '2nd';
    if (position === 3) return '3rd';
    return `${position}th`;
  };

  // Get position change icon/text
  const getPositionChange = (userId: number) => {
    // In a real app, this would compare to previous period
    const random = userId % 3;
    if (random === 0) {
      return <span className="flex items-center text-green-600"><ChevronUp className="h-4 w-4 mr-1" />2</span>;
    } else if (random === 1) {
      return <span className="flex items-center text-red-600"><ChevronDown className="h-4 w-4 mr-1" />1</span>;
    }
    return <span className="text-gray-500">-</span>;
  };

  const userPosition = getUserPosition();
  const nextPositionScore = userPosition && userPosition > 1 && leaderboardData 
    ? leaderboardData[userPosition - 2].score 
    : null;

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Leaderboard</h1>
        <h2 className="text-lg text-gray-500 mt-1">Top Weekly GreenScores</h2>

        {/* Period Selection */}
        <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex space-x-2">
            <Button
              variant={period === 'weekly' ? 'default' : 'outline'}
              size="sm"
              className={period === 'weekly' ? 'bg-green-800 hover:bg-green-700' : 'text-green-800 border-green-800 hover:bg-green-50'}
              onClick={() => setPeriod('weekly')}
            >
              Weekly
            </Button>
            <Button
              variant={period === 'monthly' ? 'default' : 'outline'}
              size="sm"
              className={period === 'monthly' ? 'bg-green-800 hover:bg-green-700' : 'text-green-800 border-green-800 hover:bg-green-50'}
              onClick={() => setPeriod('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={period === 'allTime' ? 'default' : 'outline'}
              size="sm"
              className={period === 'allTime' ? 'bg-green-800 hover:bg-green-700' : 'text-green-800 border-green-800 hover:bg-green-50'}
              onClick={() => setPeriod('allTime')}
            >
              All Time
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-6 flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Top Users */}
            <Card className="mt-6 overflow-hidden border-gray-200 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <CardTitle className="flex items-center text-green-800">
                  <Leaf className="mr-2 h-5 w-5" /> 
                  Top GreenScore Leaders
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {leaderboardData?.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between py-4 px-6 border-b border-gray-200 ${
                      item.userId === user?.id ? 'bg-green-50' : index % 2 === 0 ? 'bg-gray-50 bg-opacity-30' : ''
                    } hover:bg-green-50 transition-colors duration-150`}
                  >
                    <div className="flex items-center">
                      {index < 3 ? (
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-800 text-white font-bold">
                          {index + 1}
                        </div>
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-800 font-bold">
                          {index + 1}
                        </div>
                      )}
                      <div className="h-10 w-10 rounded-full overflow-hidden mx-3">
                        <Avatar>
                          <AvatarFallback className={`${index < 3 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {getInitials(item.username)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <div className="font-medium">{item.username}</div>
                        {index < 3 && (
                          <div className="text-xs text-green-600">
                            {index === 0 ? '🏆 Gold Leader' : index === 1 ? '🥈 Silver Leader' : '🥉 Bronze Leader'}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">
                        {getPositionChange(item.userId)}
                      </div>
                      <div className="text-xl font-bold text-green-800 bg-green-50 px-3 py-1 rounded-lg">{item.score}</div>
                    </div>
                  </div>
                ))}
                {(!leaderboardData || leaderboardData.length === 0) && (
                  <div className="py-10 text-center text-gray-500">
                    No data available. Upload receipts to start competing!
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* User Position */}
            {userPosition && (
              <Card className="mt-8 overflow-hidden border-gray-200 shadow-md">
                <CardHeader className="bg-green-50 border-b border-green-100 pb-4">
                  <CardTitle className="flex items-center text-green-800">
                    <div className="bg-green-800 text-white h-6 w-6 rounded-full flex items-center justify-center mr-2">
                      <ChevronUp className="h-4 w-4" />
                    </div>
                    Your Position
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-gradient-to-r from-green-50 to-white py-6 px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-800 text-white font-bold text-xl">
                        {userPosition}
                      </div>
                      <div className="h-12 w-12 rounded-full overflow-hidden mx-4 border-2 border-green-800">
                        <Avatar>
                          <AvatarFallback className="bg-green-100 text-green-800 text-lg">
                            {getInitials(user?.name || user?.username || '')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{formatPosition(userPosition)} Place</div>
                        <div className="text-sm text-green-700">Keep improving your GreenScore!</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-2xl font-bold text-green-800 bg-white px-4 py-2 rounded-lg border border-green-100 shadow-sm">
                        {userGreenScore?.score || 0}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Your GreenScore</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  {nextPositionScore && (
                    <div className="text-sm text-gray-700 text-center w-full bg-green-50 p-3 rounded-lg border border-green-100">
                      <span className="font-medium text-green-800">{nextPositionScore - (userGreenScore?.score || 0)} points</span> needed to climb to position <span className="font-medium text-green-800">#{userPosition - 1}</span>!
                      <div className="mt-2">
                        <Button 
                          size="sm" 
                          className="bg-green-800 hover:bg-green-700"
                          onClick={() => window.location.href = '/upload'}
                        >
                          Upload Receipt to Earn Points
                        </Button>
                      </div>
                    </div>
                  )}
                </CardFooter>
              </Card>
            )}

            {/* Tips Section */}
            <Card className="mt-8 overflow-hidden border-gray-200 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <CardTitle className="flex items-center text-green-800">
                  <div className="bg-green-800 text-white h-6 w-6 rounded-full flex items-center justify-center mr-2">
                    <Leaf className="h-4 w-4" />
                  </div>
                  Tips to Improve Your Score
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Leaf className="h-4 w-4 text-green-800" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Choose Local & Seasonal Food</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 ml-11">Buying local reduces transportation emissions and supports local farmers.</p>
                    <div className="ml-11 mt-3">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">+10 points per purchase</span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <ShoppingBag className="h-4 w-4 text-green-800" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Always Bring Reusable Bags</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 ml-11">Skip single-use plastic bags to reduce waste and earn more points.</p>
                    <div className="ml-11 mt-3">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">+5 points per shopping trip</span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Droplet className="h-4 w-4 text-green-800" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Use a Reusable Water Bottle</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 ml-11">Disposable plastic bottles have a significant environmental impact.</p>
                    <div className="ml-11 mt-3">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">+3 points per bottle avoided</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-100 mt-6">
                  <div className="flex items-center mb-2">
                    <div className="bg-green-800 text-white h-6 w-6 rounded-full flex items-center justify-center mr-2">
                      <ChevronUp className="h-4 w-4" />
                    </div>
                    <h3 className="font-medium text-green-800">Ready to climb the leaderboard?</h3>
                  </div>
                  <p className="text-sm text-gray-700 ml-8 mb-3">
                    Upload your grocery receipts to track your eco-friendly purchases and improve your score!
                  </p>
                  <div className="text-center mt-2">
                    <Button 
                      className="bg-green-800 hover:bg-green-700"
                      onClick={() => window.location.href = '/upload'}
                    >
                      Upload Your Receipts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
