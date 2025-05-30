import Footer from "../_sections/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <main>
          {children}
          <Footer></Footer>
      </main>
  );
}
