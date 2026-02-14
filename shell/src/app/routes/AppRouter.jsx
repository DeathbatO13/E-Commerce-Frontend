import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

function Home() {
  return <h2 className="text-2xl font-semibold">Home Page</h2>;
}

function AppRouter() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </MainLayout>
  );
}

export default AppRouter;
