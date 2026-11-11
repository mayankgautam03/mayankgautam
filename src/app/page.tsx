import { Navbar } from "@/components/Navbar";
import { Badge, Preloader, ScrollProgress } from "@/components/Effects";
import { Scene3D } from "@/components/Scene3D";
import { Hero } from "@/components/Hero";
import { About, ScrollMarquee, Services } from "@/components/Jack";
import { Marketing } from "@/components/Marketing";
import { AISection, WebSection } from "@/components/Showcase";
import { Journey, Skills } from "@/components/Sections";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Preloader />
      <ScrollProgress />
      <Navbar />
      <Scene3D />
      <main>
        <Hero />
        <ScrollMarquee />
        <About />
        <Services />
        <Marketing />
        <AISection />
        <WebSection />
        <Journey />
        <Skills />
      </main>
      <Contact />
      <Badge />
    </>
  );
}
