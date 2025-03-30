import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Leaf, Receipt, Calculator, Users } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                Split bills. Share impact. Go green together.
              </h1>
              <p className="mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
                EcoSplit helps you track expenses and environmental impact in one click.
              </p>
              <div className="mt-8 sm:flex">
                {!user ? (
                  <>
                    <div className="rounded-md shadow">
                      <Link href="/auth">
                        <Button className="w-full px-8 py-6 text-lg rounded-md bg-green-800 hover:bg-green-700">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link href="/auth">
                        <Button variant="outline" className="w-full px-8 py-6 text-lg rounded-md border-green-800 text-green-800 hover:bg-green-50">
                          Log in
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="rounded-md shadow">
                    <Link href="/dashboard">
                      <Button className="w-full px-8 py-6 text-lg rounded-md bg-green-800 hover:bg-green-700">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-4 text-center border-b pb-2">RECEIPT</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Grocery</span>
                    <span className="font-medium">$45.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Reusable Bag</span>
                    <span>$2.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Takeout</span>
                    <span className="font-medium">$30.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Plastic Bottle</span>
                    <span>$1.50</span>
                  </div>
                  <div className="border-t pt-3 space-y-2 mt-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                          <svg className="h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>Grocery</span>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                          <svg className="h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>Reusable Bag</span>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center mr-2">
                          <svg className="h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>Takeout</span>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-4 -top-4 bg-green-800 text-white rounded-full p-3 shadow-lg">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="white" />
                    <path d="M16 11H13V8C13 7.45 12.55 7 12 7C11.45 7 11 7.45 11 8V11H8C7.45 11 7 11.45 7 12C7 12.55 7.45 13 8 13H11V16C11 16.55 11.45 17 12 17C12.55 17 13 16.55 13 16V13H16C16.55 13 17 12.55 17 12C17 11.45 16.55 11 16 11Z" fill="#4CAF50" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 -z-10">
                <div className="w-full h-full bg-green-100 opacity-30 rounded-xl transform rotate-3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How EcoSplit Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Track your expenses and environmental impact in three simple steps
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-green-800 rounded-md shadow-lg">
                        <Receipt className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Upload Your Receipts</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Take a photo or upload your receipt. We'll extract all the important details automatically.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-green-800 rounded-md shadow-lg">
                        <Calculator className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Split Expenses Easily</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Split bills with roommates, friends or family. Everyone pays their fair share.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-green-800 rounded-md shadow-lg">
                        <Leaf className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Track Environmental Impact</h3>
                    <p className="mt-5 text-base text-gray-500">
                      We analyze your purchases and provide a GreenScore that helps you make more eco-friendly choices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Join the Community
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Compare your environmental impact with friends and others in your area
            </p>
          </div>

          <div className="mt-12 bg-white rounded-lg shadow-md overflow-hidden max-w-3xl mx-auto">
            <div className="bg-green-800 text-white py-4 px-6">
              <h3 className="text-xl font-medium">Top Weekly GreenScores</h3>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="flex items-center justify-between py-4 px-6">
                <div className="flex items-center">
                  <div className="w-8 text-center font-bold text-gray-900">1</div>
                  <div className="h-10 w-10 rounded-full overflow-hidden mx-3 bg-green-100">
                    <div className="flex items-center justify-center h-full text-green-800 font-semibold">EJ</div>
                  </div>
                  <div className="font-medium">Emma J.</div>
                </div>
                <div className="text-xl font-bold text-green-800">92</div>
              </div>
              <div className="flex items-center justify-between py-4 px-6">
                <div className="flex items-center">
                  <div className="w-8 text-center font-bold text-gray-900">2</div>
                  <div className="h-10 w-10 rounded-full overflow-hidden mx-3 bg-green-100">
                    <div className="flex items-center justify-center h-full text-green-800 font-semibold">DM</div>
                  </div>
                  <div className="font-medium">David M.</div>
                </div>
                <div className="text-xl font-bold text-green-800">88</div>
              </div>
              <div className="flex items-center justify-between py-4 px-6">
                <div className="flex items-center">
                  <div className="w-8 text-center font-bold text-gray-900">3</div>
                  <div className="h-10 w-10 rounded-full overflow-hidden mx-3 bg-green-100">
                    <div className="flex items-center justify-center h-full text-green-800 font-semibold">SL</div>
                  </div>
                  <div className="font-medium">Sarah L.</div>
                </div>
                <div className="text-xl font-bold text-green-800">86</div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <Link href="/leaderboard" className="text-green-800 hover:text-green-700 font-medium flex items-center justify-center">
                View Full Leaderboard
                <svg className="ml-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
