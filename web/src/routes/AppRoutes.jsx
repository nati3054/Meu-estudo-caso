import { Routes, Route } from "react-router-dom";
import ListaProduto from "../pages/ListaProduto";
import FormProduto from "../pages/FormProduto";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ListaProduto />} />
      <Route path="/novo" element={<FormProduto />} />
      <Route path="/editar/:id" element={<FormProduto />} />
    </Routes>
  );
}
