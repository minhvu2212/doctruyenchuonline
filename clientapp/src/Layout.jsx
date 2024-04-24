import Footer from "./Footer";
import Header from "./Header";


export default function Layout({children}) {
  return (
    <div className="mt-2 sm:mt-5 flex flex-col min-h-screen">
      <Header />
      <div className="pb-16">
      {children}
      </div>
      <Footer />
    </div>
  );
}
