import { criarFavoritos, listarFavoritos, deletarFavorito } from "./favoritos.controller.js"
import express from "express"


const route = express.Router();
route.post("/", criarFavoritos);
route.get("/", listarFavoritos);
route.delete("/:id", deletarFavorito);
route.get('/usuario/:id', listarFavoritosPorUsuario);


export default route