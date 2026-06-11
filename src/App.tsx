import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import { Applications } from '@/pages/Applications';
import { ApplicationDetail } from '@/pages/ApplicationDetail';
import { ResumeTailor } from '@/pages/ResumeTailor';
import { CoverLetter } from '@/pages/CoverLetter';
import { InterviewPrep } from '@/pages/InterviewPrep';
import { ATSAnalyzer } from '@/pages/ATSAnalyzer';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="applications/:id" element={<ApplicationDetail />} />
          <Route path="ai/resume-tailor" element={<ResumeTailor />} />
          <Route path="ai/cover-letter" element={<CoverLetter />} />
          <Route path="ai/interview-prep" element={<InterviewPrep />} />
          <Route path="ai/ats-analyzer" element={<ATSAnalyzer />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
