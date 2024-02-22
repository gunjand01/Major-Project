import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './component/login';
import Registration from './component/signup';
import Dashboard from './component/dashboard';
import UploadResume from './component/uploadResume';
import "./styles/login_signin.css";
import "./styles/uploadResume.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/resumeUpload" element={< UploadResume/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
