// import db from "../config/db.js"
// // ============================
// //  Rotas CRUD
// // ============================

// export async function criarAvaliacoes(req, res) {
//     try {
//         const { usuario_id, livro_id, nota, comentario } = req.body;
//         if (!usuario_id || !livro_id || !nota || !comentario)
//             return res.status(400).json({ erro: "Campos obrigatórios" });

//         await db.execute(
//             "INSERT INTO livros (usuario_id, livro_id, nota, comentario) VALUES (?, ?, ?, ?)",
//             [usuario_id, livro_id, nota, comentario]
//         );

//         res.json({ mensagem: "Avaliações feitas com sucesso!" });
//     } catch (err) {
//         res.status(500).json({ erro: err.message });
//     }
// };

// export async function listarAvaliacoes(req, res) {
//     try {
//         const [rows] = await db.execute("SELECT * FROM avaliacoes");
//         res.json(rows);
//     } catch (err) {
//         res.status(500).json({ erro: err.message });
//     }
// };

// export async function obterAvaliacao(req, res) {
//     try {
//         const [rows] = await db.execute("SELECT * FROM avaliacoes WHERE id = ?", [
//             req.params.id,
//         ]);
//         if (rows.length === 0)
//             return res.status(404).json({ erro: "Avaliação não encontrada" });
//         res.json(rows[0]);
//     } catch (err) {
//         res.status(500).json({ erro: err.message });
//     }
// };

// export async function atualizarAvaliacao(req, res) {
//     try {
//         const { usuario_id, livro_id, nota, comentario} = req.body;
//         await db.execute(
//             "UPDATE livros SET usuario_id = ?, livro_id = ?, nota = ?, comentario = ?   WHERE id = ?",
//             [usuario_id, livro_id, nota, comentario]
//         );
//         res.json({ mensagem: "Avaliação atualizada com sucesso!" });
//     } catch (err) {
//         res.status(500).json({ erro: err.message });
//     }
// };

// export async function deletarAvaliacao(req, res) {
//     try {
//         await db.execute("DELETE FROM avaliacoes WHERE id = ?", [req.params.id]);
//         res.json({ mensagem: "Avaliação deletada com sucesso!" });
//     } catch (err) {
//         res.status(500).json({ erro: err.message });
//     }
// };

// export async function listarAvaliacoesLivrosDetalhado(req, res) {
//     try {
//         const [rows] = await db.execute(
//             `SELECT 
//                 l.id as livro_id,
//                 l.titulo as titulo_livro,
//                 l.autor,
//                 l.ano_publicacao,
//                 ROUND(AVG(a.nota), 2) as media_notas,
//                 COUNT(a.id) as total_avaliacoes,
//                 MIN(a.nota) as menor_nota,
//                 MAX(a.nota) as maior_nota
//             FROM livros l
//             LEFT JOIN avaliacoes a ON l.id = a.livro_id
//             GROUP BY l.id, l.titulo, l.autor, l.ano_publicacao
//             ORDER BY media_notas DESC, total_avaliacoes DESC`
//         );

//         res.json({
//             quantidade_livros: rows.length,
//             livros: rows.map(livro => ({
//                 livro_id: livro.livro_id,
//                 titulo: livro.titulo_livro,
//                 autor: livro.autor,
//                 ano_publicacao: livro.ano_publicacao,
//                 avaliacoes: {
//                     media: livro.media_notas ? parseFloat(livro.media_notas) : 0,
//                     total: parseInt(livro.total_avaliacoes),
//                     menor_nota: livro.menor_nota ? parseInt(livro.menor_nota) : null,
//                     maior_nota: livro.maior_nota ? parseInt(livro.maior_nota) : null
//                 }
//             }))
//         });
//     } catch (err) {
//         res.status(500).json({ erro: err.message });
//     }
// };

import db from "../config/db.js"

// ============================
//  Rotas CRUD
// ============================

export async function criarAvaliacoes(req, res) {
    try {
        const { usuario_id, livro_id, nota, comentario } = req.body;
        
        // Validação simples dos campos
        if (!usuario_id || !livro_id || !nota || !comentario) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        // Validação simples da nota
        if (nota < 1 || nota > 5) {
            return res.status(400).json({ erro: "Nota deve ser entre 1 e 5" });
        }

        // CORREÇÃO: Inserir na tabela avaliacoes, não livros
        await db.execute(
            "INSERT INTO avaliacoes (usuario_id, livro_id, nota, comentario) VALUES (?, ?, ?, ?)",
            [usuario_id, livro_id, nota, comentario]
        );

        res.json({ mensagem: "Avaliação criada com sucesso!" });
    } catch (err) {
        // Erro simples para avaliação duplicada
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ erro: "Usuário já avaliou este livro" });
        }
        res.status(500).json({ erro: "Erro ao criar avaliação" });
    }
};

export async function listarAvaliacoes(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM avaliacoes");
        
        // Verificação simples se não há avaliações
        if (rows.length === 0) {
            return res.status(404).json({ erro: "Nenhuma avaliação encontrada" });
        }
        
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao listar avaliações" });
    }
};

export async function obterAvaliacao(req, res) {
    try {
        const id = req.params.id;
        
        // Validação simples do ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ erro: "ID inválido" });
        }

        const [rows] = await db.execute("SELECT * FROM avaliacoes WHERE id = ?", [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ erro: "Avaliação não encontrada" });
        }
        
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar avaliação" });
    }
};

export async function atualizarAvaliacao(req, res) {
    try {
        const id = req.params.id;
        const { usuario_id, livro_id, nota, comentario } = req.body;

        // Validação simples do ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ erro: "ID inválido" });
        }

        // Validação simples dos campos
        if (!usuario_id || !livro_id || !nota || !comentario) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        // Validação simples da nota
        if (nota < 1 || nota > 5) {
            return res.status(400).json({ erro: "Nota deve ser entre 1 e 5" });
        }

        // CORREÇÃO: Atualizar na tabela avaliacoes, não livros
        await db.execute(
            "UPDATE avaliacoes SET usuario_id = ?, livro_id = ?, nota = ?, comentario = ? WHERE id = ?",
            [usuario_id, livro_id, nota, comentario, id]
        );

        res.json({ mensagem: "Avaliação atualizada com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao atualizar avaliação" });
    }
};

export async function deletarAvaliacao(req, res) {
    try {
        const id = req.params.id;
        
        // Validação simples do ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ erro: "ID inválido" });
        }

        // Verificação simples se a avaliação existe
        const [avaliacao] = await db.execute("SELECT id FROM avaliacoes WHERE id = ?", [id]);
        if (avaliacao.length === 0) {
            return res.status(404).json({ erro: "Avaliação não encontrada" });
        }

        await db.execute("DELETE FROM avaliacoes WHERE id = ?", [id]);
        
        res.json({ mensagem: "Avaliação deletada com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao deletar avaliação" });
    }
};

export async function listarAvaliacoesLivrosDetalhado(req, res) {
    try {
        const [rows] = await db.execute(
            `SELECT 
                l.id as livro_id,
                l.titulo as titulo_livro,
                l.autor,
                l.ano_publicacao,
                ROUND(AVG(a.nota), 2) as media_notas,
                COUNT(a.id) as total_avaliacoes,
                MIN(a.nota) as menor_nota,
                MAX(a.nota) as maior_nota
            FROM livros l
            LEFT JOIN avaliacoes a ON l.id = a.livro_id
            GROUP BY l.id, l.titulo, l.autor, l.ano_publicacao
            ORDER BY media_notas DESC, total_avaliacoes DESC`
        );

        // Verificação simples se não há livros
        if (rows.length === 0) {
            return res.status(404).json({ erro: "Nenhum livro encontrado" });
        }

        res.json({
            quantidade_livros: rows.length,
            livros: rows.map(livro => ({
                livro_id: livro.livro_id,
                titulo: livro.titulo_livro,
                autor: livro.autor,
                ano_publicacao: livro.ano_publicacao,
                avaliacoes: {
                    media: livro.media_notas ? parseFloat(livro.media_notas) : 0,
                    total: parseInt(livro.total_avaliacoes),
                    menor_nota: livro.menor_nota ? parseInt(livro.menor_nota) : null,
                    maior_nota: livro.maior_nota ? parseInt(livro.maior_nota) : null
                }
            }))
        });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao listar avaliações dos livros" });
    }
};