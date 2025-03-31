import Hero from "@/components/landing/Hero";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex ites-center justify-center w-full  h-screen">
      <div className="flex flex-col h-full w-full max-w-[1100px]">
        <Nav />
        <Hero />
        <Footer />
      </div>
    </div>
  );
}
