import Hero from "./components/Hero";
import Acerca from "./components/Acerca";
import Clients from "./components/Clients";
import Servicios from "./components/Servicios";
import Projects from "./components/Projects";
import Eventos from "./components/Eventos";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import logoSVG from "./components/Logo";

export default function Home() {
  return (
    <div className="bg-black pt-20 overflow-x-hidden">
      <div className="flex min-h-screen items-center justify-center">
        <Hero svgContent={logoSVG} duration={1.5} delay={0.3} />
      </div>
      <Acerca />
      <Clients />
      <Servicios />
      <Projects />
      <Eventos />
      <ContactForm />
      <Footer />
    </div>
  );
}
