// import db from "../config/db.js"
// // ============================
// //  Rotas CRUD
// // ============================

// export async function criarUsuario(req, res) {
//     try {
//         const { nome, email, senha, perfil } = req.body;
//         if (!nome || !email || !senha || !perfil)
//             return res.status(400).json({ erro: "Campos obrigatórios" });

//         await db.execute(
//             "INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?)",
//             [nome, email, senha, perfil]
//         );

//         res.json({ mensagem: "Usuário criado com sucesso!" });
//     } catch (err) {
//         res.status(500).json({ erro: err.message });
//     }
// };

// export async function listarUsuarios(req, res) {
//     try {
//         const [rows] = await db.execute("SELECT * FROM usuarios");
//         res.json(rows);
//     } catch (err) {
//         res.status(500).json({ erro: err.message });
//     }
// };

// export async function obterUsuario(req, res) {
//     try {
//         const [rows] = await db.execute("SELECT * FROM usuarios WHERE id = ?", [
//             req.params.id,
//         ]);
//         if (rows.length === 0)
//             return res.status(404).json({ erro: "Usuário não encontrado" });
//         res.json(rows[0]);
//     } catch (err) {
//         res.status(500).json({ erro: err.message });
//     }
// };

// export async function atualizarUsuario(req, res) {
//     try {
//         const { nome, email, senha, perfil } = req.body;
//         await db.execute(
//             "UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?",
//             [nome, email, senha, perfil, req.params.id]
//         );
//         res.json({ mensagem: "Usuário atualizado com sucesso!" });
//     } catch (err) {
//         res.status(500).json({ erro: err.message });
//     }
// };

// export async function deletarUsuario(req, res) {
//     try {
//         await db.execute("DELETE FROM usuarios WHERE id = ?", [req.params.id]);
//         res.json({ mensagem: "Usuário deletado com sucesso!" });
//     } catch (err) {
//         res.status(500).json({ erro: err.message });
//     }
// };

import db from "../config/db.js"
// ============================
//  Rotas CRUD
// ============================

export async function criarUsuario(req, res) {
    try {
        const { nome, email, senha, perfil } = req.body;
        
        // Validação simples
        if (!nome || !email || !senha || !perfil) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios: nome, email, senha, perfil" });
        }

        // Validação de email simples
        if (!email.includes('@')) {
            return res.status(400).json({ erro: "Email inválido" });
        }

        // CORREÇÃO: Faltou o parâmetro 'perfil' na query
        await db.execute(
            "INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)",
            [nome, email, senha, perfil]
        );

        res.status(201).json({ mensagem: "Usuário criado com sucesso!" });
    } catch (err) {
        // Erro simples para duplicação de email
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ erro: "Email já cadastrado" });
        }
        res.status(500).json({ erro: "Erro ao criar usuário" });
    }
};

export async function listarUsuarios(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM usuarios");
        
        // Verificação simples se não há usuários
        if (rows.length === 0) {
            return res.status(404).json({ erro: "Nenhum usuário encontrado" });
        }
        
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao listar usuários" });
    }
};

export async function obterUsuario(req, res) {
    try {
        const id = req.params.id;
        
        // Validação simples do ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ erro: "ID inválido" });
        }

        const [rows] = await db.execute("SELECT * FROM usuarios WHERE id = ?", [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }
        
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar usuário" });
    }
};

export async function atualizarUsuario(req, res) {
    try {
        const id = req.params.id;
        const { nome, email, senha, perfil } = req.body;

        // Validação simples do ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ erro: "ID inválido" });
        }

        // Validação simples dos campos
        if (!nome || !email || !perfil) {
            return res.status(400).json({ erro: "Campos nome, email e perfil são obrigatórios" });
        }

        // CORREÇÃO: Query estava incompleta - faltou o campo 'perfil' e tinha parâmetros extras
        await db.execute(
            "UPDATE usuarios SET nome = ?, email = ?, senha = ?, perfil = ? WHERE id = ?",
            [nome, email, senha, perfil, id]
        );

        res.json({ mensagem: "Usuário atualizado com sucesso!" });
    } catch (err) {
        // Erro simples para duplicação de email
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ erro: "Email já está em uso por outro usuário" });
        }
        res.status(500).json({ erro: "Erro ao atualizar usuário" });
    }
};

export async function deletarUsuario(req, res) {
    try {
        const id = req.params.id;
        
        // Validação simples do ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ erro: "ID inválido" });
        }

        // Verificação simples se o usuário existe
        const [usuario] = await db.execute("SELECT id FROM usuarios WHERE id = ?", [id]);
        if (usuario.length === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        await db.execute("DELETE FROM usuarios WHERE id = ?", [id]);
        
        res.json({ mensagem: "Usuário deletado com sucesso!" });
    } catch (err) {
        // Erro simples para restrição de chave estrangeira
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ erro: "Não é possível deletar usuário com registros vinculados" });
        }
        res.status(500).json({ erro: "Erro ao deletar usuário" });
    }
};