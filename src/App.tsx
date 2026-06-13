
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ListingsPage from "./pages/ListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import AgenciesPage from "./pages/AgenciesPage";
import AgencyDetailPage from "./pages/AgencyDetailPage";
import PricingPage from "./pages/PricingPage";
import DashboardPage from "./pages/DashboardPage";
import AddPropertyPage from "./pages/AddPropertyPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminAgenciesPage from "./pages/AdminAgenciesPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminPropertiesPage from "./pages/AdminPropertiesPage";
import AdminSubscriptionsPage from "./pages/AdminSubscriptionsPage";
import AdminNotificationsPage from "./pages/AdminNotificationsPage";
import AdminBannersPage from "./pages/AdminBannersPage";
import AdminCouponsPage from "./pages/AdminCouponsPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import MyPropertiesPage from "./pages/MyPropertiesPage";
import DraftPropertiesPage from "./pages/DraftPropertiesPage";
import MessagesPage from "./pages/MessagesPage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentErrorPage from "./pages/PaymentErrorPage";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/biens" element={<ListingsPage />} />
              <Route path="/bien/:id" element={<PropertyDetailPage />} />
              <Route path="/agences" element={<AgenciesPage />} />
              <Route path="/agence/:id" element={<AgencyDetailPage />} />
              <Route path="/tarifs" element={<PricingPage />} />
              <Route path="/paiement/:plan" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path="/paiement/succes" element={<PaymentSuccessPage />} />
              <Route path="/paiement/echec" element={<PaymentErrorPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/dashboard/biens" element={<ProtectedRoute><MyPropertiesPage /></ProtectedRoute>} />
              <Route path="/dashboard/brouillons" element={<ProtectedRoute><DraftPropertiesPage /></ProtectedRoute>} />
              <Route path="/dashboard/ajouter" element={<ProtectedRoute><AddPropertyPage /></ProtectedRoute>} />
              <Route path="/dashboard/modifier/:id" element={<ProtectedRoute><AddPropertyPage /></ProtectedRoute>} />
              <Route path="/dashboard/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
              <Route path="/dashboard/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
              <Route path="/dashboard/parametres" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
              <Route path="/admin/agences" element={<AdminRoute><AdminAgenciesPage /></AdminRoute>} />
              <Route path="/admin/utilisateurs" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
              <Route path="/admin/biens" element={<AdminRoute><AdminPropertiesPage /></AdminRoute>} />
              <Route path="/admin/abonnements" element={<AdminRoute><AdminSubscriptionsPage /></AdminRoute>} />
              <Route path="/admin/notifications" element={<AdminRoute><AdminNotificationsPage /></AdminRoute>} />
              <Route path="/admin/parametres" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />
              <Route path="/admin/bannieres" element={<AdminRoute><AdminBannersPage /></AdminRoute>} />
              <Route path="/admin/coupons" element={<AdminRoute><AdminCouponsPage /></AdminRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
