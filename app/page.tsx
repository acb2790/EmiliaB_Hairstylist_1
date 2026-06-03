import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Portfolio />
        <Services />
        <AvailabilityCalendar />
        <QuoteForm />
      </main>
      <Footer />
    </>
  );
}
