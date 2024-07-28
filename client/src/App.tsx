import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NotFound from './pages/not-found';
import Dashboard from './pages/dashboard';
import ProtectedRoutes from './utils/ProtectedRoutes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TenantsPage from './pages/tenants';
import BillPerTenantsPage from './pages/tenants/tenantBill';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* PAGES or ROUTES */}
          <Route element={<ProtectedRoutes />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/tenants' element={<TenantsPage />} />
            <Route
              path='/tenants/:tenantId/bill'
              element={<BillPerTenantsPage />}
            />

            <Route path='*' element={<Navigate to='/not-found' />} />
          </Route>

          <Route path='/not-found' element={<NotFound />} />

          <Route path='*' element={<Navigate to='/not-found' />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
