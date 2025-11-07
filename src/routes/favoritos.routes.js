import { criarFavoritos, listarFavoritos, deletarFavorito } from "../controllers/favoritos.controller.js"
import express from "express"


const route = express.Router();
route.post("/", criarFavoritos);
route.get("/", listarFavoritos);
route.delete("/:id", deletarFavorito);


export default route