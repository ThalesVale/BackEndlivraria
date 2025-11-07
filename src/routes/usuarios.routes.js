import { criarUsuario, listarUsuarios, obterUsuario, atualizarUsuario, deletarUsuario } from "../controllers/usuarios.controller.js"
import express from "express"


const route = express.Router();

route.get("/", listarUsuarios);
route.get("/:id", obterUsuario);
route.post("/", criarUsuario);
route.put("/:id", atualizarUsuario);
route.delete("/:id", deletarUsuario);


export default route