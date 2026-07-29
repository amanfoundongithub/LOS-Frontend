import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ApexLendingLogin from './login/LoginPage'; 
import ApexLendingSignup from './register/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<ApexLendingLogin />} />
        <Route path="/signup" element={<ApexLendingSignup />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
