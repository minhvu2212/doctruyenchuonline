import Footer from "./Footer";
import Header from "./Header";


export default function Layout({children}) {
  return (
    <div className=" flex flex-col min-h-screen" /*style={{backgroundColor:'rgb(232 206 129 / 33%)'}}*/> 
      <Header />
      <div className="pb-16">
      {children}
      </div>
      <Footer />
    </div>
  );
}
