import { Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Event from "./components/Event";
import Home from "../src/components/Home";
import Dashboard from "./components/Dashboard";
import Form from "./components/Form";

function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event" element={<Event />} />
        <Route path="/profile" element={<Dashboard />} />
        <Route path="/form" element={<Form />} />

        <Route />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
