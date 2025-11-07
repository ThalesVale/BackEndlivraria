import { criarReserva, listarRservas, deletarReserva } from "../controllers/reservas.controller.js"
import express from "express"


const route = express.Router();
route.post("/", criarReserva);
route.get("/", listarRservas);
route.delete("/:id", deletarReserva);


export default route