import { criarAvaliacoes, listarAvaliacoes, obterAvaliacao, atualizarAvaliacao, deletarAvaliacao, listarAvaliacoesLivrosDetalhado } from "../controllers/avaliacoes.controller.js"
import express from "express"


const route = express.Router();
route.post("/", criarAvaliacoes);
route.get("/", listarAvaliacoes);
route.get("/:id", obterAvaliacao);
route.put("/:id", atualizarAvaliacao);
route.delete("/:id", deletarAvaliacao);
route.get('/avaliacoes', listarAvaliacoesLivrosDetalhado);


export default route