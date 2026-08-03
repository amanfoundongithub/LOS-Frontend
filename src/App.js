import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ApexLendingLogin from './login/LoginPage'; 
import ApexLendingSignup from './register/RegisterPage';
import NotificationAdminDashboard from './dashboard/notification_admin/NotificationAdminDashboard';
import IAMAdminDashboard from './dashboard/admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<ApexLendingLogin />} />
        <Route path="/signup" element={<ApexLendingSignup />} />
        <Route path="/notification/admin" element={<NotificationAdminDashboard />}/>
        <Route path="/iam/admin" element = {<IAMAdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
