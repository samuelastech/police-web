import './styles/global.css';
import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import OperationsMap from './pages/OperationsMap';
import Layout from './components/Layout';
import Missing from './components/Missing';
import AdminDashboard from './pages/AdminDashboard';
import Unauthorized from './components/Unauthorized';
import Home from './components/Home';
import PersistLogin from './components/PersistLogin';

enum Roles {
  OPERATOR = 'operator',
  POLICE = 'police',
  MANAGER = 'manager'
}

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* Public routes */}
        <Route path='login' element={<Login />} />
        <Route path='unauthorized' element={<Unauthorized />} />
        

        {/* Private routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[Roles.OPERATOR]} />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='app' element={<OperationsMap />} />
          </Route>
          
          <Route element={<RequireAuth allowedRoles={[Roles.MANAGER, Roles.MANAGER]} />}>
            <Route path="/" element={<Home />} />
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