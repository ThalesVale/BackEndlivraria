import { criarReserva, listarRservas, deletarReserva, verificarReserva } from "../controllers/reservas.controller.js"
import express from "express"


const route = express.Router();
route.post("/", criarReserva);
route.get("/", listarRservas);
route.delete("/:id", deletarReserva);
route.head("/:id", verificarReserva);
route.get('/verificar/:livro_id', verificarReserva);

export default route