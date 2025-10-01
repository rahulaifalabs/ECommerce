// AUTO-CONVERTED: extension changed to TypeScript. Please review and add explicit types.
import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "./Footer";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full">
        <Outlet />
      </main>
      <footer>
        <Footer/>
      </footer>
    </div>
  );
}

export default ShoppingLayout;
