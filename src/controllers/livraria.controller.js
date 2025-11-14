// import db from "../config/db.js"
// // ============================
// //  Rotas CRUD
// // ============================

// export async function criarLivro(req, res) {
//     try {
//         const {titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse} = req.body;
//         if (!titulo || !autor || !genero || !editora || !ano_publicacao || !isbn || !idioma || !formato || !caminho_capa || !sinopse)
//             return res.status(400).json({ erro: "Campos obrigatórios" });

//         await db.execute(
//             "INSERT INTO livros (titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//             [titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse]
//         );

//         res.json({ mensagem: "Livro criado com sucesso!" });
//     } catch (err) {
//         res.status(500).json({ erro: err.message });
//     }
// };

// export async function listarLivro(req, res) {
//     try {
//         const [rows] = await db.execute("SELECT * FROM livros");
//         res.json(rows);
//     } catch (err) {
//         res.status(500).json({ erro: err.message });
//     }
// };

// export async function obterLivro(req, res) {
//     try {
//         const [rows] = await db.execute("SELECT * FROM livros WHERE id = ?", [
//             req.params.id,
//         ]);
//         if (rows.length === 0)
//             return res.status(404).json({ erro: "Livro não encontrado" });
//         res.json(rows[0]);
//     } catch (err) {
//         res.status(500).json({ erro: err.message });
//     }
// };

// export async function atualizarLivro(req, res) {
//     try {
//         const { titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse} = req.body;
//         await db.execute(
//             "UPDATE livros SET titulo = ?, autor = ?, genero = ?, editora = ?, ano_publicacao = ?, isbn = ?, idioma = ?, formato = ?, caminho_capa, sinopse = ?   WHERE id = ?",
//             [titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse, req.params.id]
//         );
//         res.json({ mensagem: "Livro atualizado com sucesso!" });
//     } catch (err) {
//         res.status(500).json({ erro: err.message });
//     }
// };

// export async function deletarLivro(req, res) {
//     try {
//         await db.execute("DELETE FROM livros WHERE id = ?", [req.params.id]);
//         res.json({ mensagem: "Livro deletado com sucesso!" });
//     } catch (err) {
//         res.status(500).json({ erro: err.message });
//     }
// };

import db from "../config/db.js"

// ============================
//  Rotas CRUD
// ============================

export async function criarLivro(req, res) {
    try {
        const {titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse} = req.body;
        
        // Validação simples dos campos obrigatórios
        if (!titulo || !autor || !genero || !editora || !ano_publicacao || !isbn || !idioma || !formato || !caminho_capa || !sinopse) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        await db.execute(
            "INSERT INTO livros (titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse]
        );

        res.json({ mensagem: "Livro criado com sucesso!" });
    } catch (err) {
        // Erro simples para ISBN duplicado
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ erro: "Livro já cadastrado" });
        }
        res.status(500).json({ erro: "Erro ao criar livro" });
    }
};

export async function listarLivro(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM livros");
        
        // Verificação simples se não há livros
        if (rows.length === 0) {
            return res.status(404).json({ erro: "Nenhum livro encontrado" });
        }
        
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao listar livros" });
    }
};

export async function obterLivro(req, res) {
    try {
        const id = req.params.id;
        
        // Validação simples do ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ erro: "ID inválido" });
        }

        const [rows] = await db.execute("SELECT * FROM livros WHERE id = ?", [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ erro: "Livro não encontrado" });
        }
        
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar livro" });
    }
};

export async function atualizarLivro(req, res) {
    try {
        const id = req.params.id;
        const { titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse} = req.body;

        // Validação simples do ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ erro: "ID inválido" });
        }

        // Validação simples dos campos
        if (!titulo || !autor || !genero || !editora || !ano_publicacao || !isbn || !idioma || !formato || !caminho_capa || !sinopse) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        // CORREÇÃO: Query estava com erro de sintaxe - faltou = após caminho_capa
        await db.execute(
            "UPDATE livros SET titulo = ?, autor = ?, genero = ?, editora = ?, ano_publicacao = ?, isbn = ?, idioma = ?, formato = ?, caminho_capa = ?, sinopse = ? WHERE id = ?",
            [titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse, id]
        );

        res.json({ mensagem: "Livro atualizado com sucesso!" });
    } catch (err) {
        // Erro simples para ISBN duplicado
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ erro: "ISBN já está em uso" });
        }
        res.status(500).json({ erro: "Erro ao atualizar livro" });
    }
};

export async function deletarLivro(req, res) {
    try {
        const id = req.params.id;
        
        // Validação simples do ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ erro: "ID inválido" });
        }

        // Verificação simples se o livro existe
        const [livro] = await db.execute("SELECT id FROM livros WHERE id = ?", [id]);
        if (livro.length === 0) {
            return res.status(404).json({ erro: "Livro não encontrado" });
        }

        await db.execute("DELETE FROM livros WHERE id = ?", [id]);
        
        res.json({ mensagem: "Livro deletado com sucesso!" });
    } catch (err) {
        // Erro simples para restrição de chave estrangeira
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ erro: "Não é possível deletar livro com reservas ou avaliações" });
        }
        res.status(500).json({ erro: "Erro ao deletar livro" });
    }
};