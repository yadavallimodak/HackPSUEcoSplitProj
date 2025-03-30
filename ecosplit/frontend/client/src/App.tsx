import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import ReceiptHistoryPage from "@/pages/receipt-history-page";
import UploadReceiptPage from "@/pages/upload-receipt-page";
import LeaderboardPage from "@/pages/leaderboard-page";
import ApiTest from "./pages/ApiTest";
import { ProtectedRoute } from "./lib/protected-route";
import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/api-test" component={ApiTest} />
          <ProtectedRoute path="/dashboard" component={DashboardPage} />
          <ProtectedRoute path="/receipts" component={ReceiptHistoryPage} />
          <ProtectedRoute path="/upload" component={UploadReceiptPage} />
          <ProtectedRoute path="/leaderboard" component={LeaderboardPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
