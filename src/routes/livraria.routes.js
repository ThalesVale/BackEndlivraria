import { criarLivro, listarLivro, obterLivro, atualizarLivro, deletarLivro } from "../controllers/livraria.controller.js"
import express from "express"


const route = express.Router();
route.post("/", criarLivro);
route.get("/", listarLivro);
route.get("/:id", obterLivro);
route.put("/:id", atualizarLivro);
route.delete("/:id", deletarLivro);


export default route