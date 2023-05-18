import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import Home from "./pages/Home";
import NewPost from "./components/NewPost";
import UserPage from "./pages/UserPage";
import SearchPage from "./pages/SearchPage";
import Modal from "./components/Modal";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/search",
          element: <SearchPage />,
        },
        {
          path: "/new-post",
          element: <NewPost />,
        },
        {
          path: "/:profilename",
          element: <UserPage />,
        },
        {
          path: "/:profilename/:postname",
          element: <Modal />,
        },
      ],
    },
  ]);

  return (
    <div className="container">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
