import './styles/global.css';
import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';
import { Login, Dashboard, OperationsMap, AdminDashboard } from './pages/';
import Layout from './components/Layout';
import Missing from './components/Missing';
import PersistLogin from './components/PersistLogin';
import { WorkLayout } from './context/WorkProvider';
import { Roles } from './types/users.type';
import { OperationsProvider } from './context/OperationsContext';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* Public routes */}
        <Route path='login' element={<Login />} />
        
        {/* Private routes */}
        <Route element={<PersistLogin />}>
          <Route element={<WorkLayout />}>
            <Route element={<RequireAuth allowedRoles={[Roles.OPERATOR]} />}>
              <Route path='dashboard' element={<Dashboard />} />
              <Route element={<OperationsProvider />}>
                <Route path='app' element={<OperationsMap />} />
              </Route>
            </Route>
          </Route> 

          <Route element={<RequireAuth allowedRoles={[Roles.MANAGER]} />}>
            <Route path='admin' element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path='*' element={<Missing />} />
      </Route>
    </Routes>
  );
}