import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Work from "@/components/Work";
import Archive from "@/components/Archive";
import Playground from "@/components/Playground";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <Cursor />
      <Nav />
      <div className="grain" aria-hidden />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Work />
        <Archive />
        <Playground />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
