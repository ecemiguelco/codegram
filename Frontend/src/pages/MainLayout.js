import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";

function MainLayout() {
  return (
    <>
      <Navigation />
      <div className="App">
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;
