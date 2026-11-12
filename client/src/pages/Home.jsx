import Hero from '../components/home/Hero.jsx';
import ServicesGrid from '../components/home/ServicesGrid.jsx';
import CoursesSection from '../components/home/CoursesSection.jsx';
import { COURSES_ENABLED } from '../data/courses.js';
import WhyChooseUs from '../components/home/WhyChooseUs.jsx';
import PricingSection from '../components/home/PricingSection.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import FaqSection from '../components/home/FaqSection.jsx';
import CallbackBanner from '../components/home/CallbackBanner.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      {COURSES_ENABLED && <CoursesSection />}
      <WhyChooseUs />
      <PricingSection />
      <Testimonials />
      <FaqSection />
      <CallbackBanner />
    </>
  );
}
