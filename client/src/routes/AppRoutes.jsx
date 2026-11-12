import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout.jsx';
import Home from '../pages/Home.jsx';
import About from '../pages/About.jsx';
import Services from '../pages/Services.jsx';
import Courses from '../pages/Courses.jsx';
import CourseDetail from '../pages/CourseDetail.jsx';
import Pricing from '../pages/Pricing.jsx';
import TrialForm from '../pages/TrialForm.jsx';
import Contact from '../pages/Contact.jsx';
import ComplaintBoard from '../pages/ComplaintBoard.jsx';
import GrievanceRedressal from '../pages/GrievanceRedressal.jsx';
import PaymentSuccess from '../pages/PaymentSuccess.jsx';
import PaymentFailed from '../pages/PaymentFailed.jsx';
import NotFound from '../pages/NotFound.jsx';
import PrivacyPolicy from '../pages/legal/PrivacyPolicy.jsx';
import UserConsent from '../pages/legal/UserConsent.jsx';
import InvestorCharter from '../pages/legal/InvestorCharter.jsx';
import Disclosure from '../pages/legal/Disclosure.jsx';
import Terms from '../pages/legal/Terms.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:slug" element={<CourseDetail />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="free-trial" element={<TrialForm />} />
        <Route path="contact" element={<Contact />} />
        <Route path="complaint-board" element={<ComplaintBoard />} />
        <Route path="grievance-redressal" element={<GrievanceRedressal />} />
        <Route path="payment/success" element={<PaymentSuccess />} />
        <Route path="payment/failed" element={<PaymentFailed />} />
        <Route path="legal/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="legal/user-consent" element={<UserConsent />} />
        <Route path="legal/investor-charter" element={<InvestorCharter />} />
        <Route path="legal/disclosure" element={<Disclosure />} />
        <Route path="legal/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
