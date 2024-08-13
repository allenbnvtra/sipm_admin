import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// PAGES
import NotFound from './pages/not-found';
import Dashboard from './pages/dashboard';
import ProtectedRoutes from './utils/ProtectedRoutes';
import TenantsPage from './pages/tenants';
import BillPerTenantsPage from './pages/tenants/tenantBill';
import InboxPage from './pages/inbox';
import LoginPage from './pages/login';
import { Provider } from 'react-redux';
import { store } from './redux/store';

function App() {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* PAGES or ROUTES */}
            <Route element={<ProtectedRoutes />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/tenants' element={<TenantsPage />} />
              <Route path='/inbox' element={<InboxPage />} />
              <Route path='/inbox/m/:userId' element={<InboxPage />} />
              <Route
                path='/tenants/:tenantId'
                element={<BillPerTenantsPage />}
              />
              <Route path='*' element={<Navigate to='/not-found' />} />
            </Route>

            <Route path='/' element={<LoginPage />} />

            <Route path='/not-found' element={<NotFound />} />

            <Route path='*' element={<Navigate to='/not-found' />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
