import { BrowserRouter, Route, Routes } from "react-router-dom";
import Admin from "./components/Admin";
import User from "./components/User";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/user" element={<User />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
