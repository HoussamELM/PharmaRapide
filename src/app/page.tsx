import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import WhyChooseUs from '@/components/WhyChooseUs';
import ContactQuick from '@/components/ContactQuick';
import Reviews from '@/components/Reviews';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
              <HowItWorks />
        <WhyChooseUs />
        <Reviews />
        <ContactQuick />
        <Footer />
    </div>
  );
}
