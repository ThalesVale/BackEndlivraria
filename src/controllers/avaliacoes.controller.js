import db from "../config/db.js"
// ============================
//  Rotas CRUD
// ============================

export async function criarAvaliacoes(req, res) {
    try {
        const { usuario_id, livro_id, nota, comentario } = req.body;
        if (!usuario_id || !livro_id || !nota || !comentario)
            return res.status(400).json({ erro: "Campos obrigatórios" });

        await db.execute(
            "INSERT INTO livros (usuario_id, livro_id, nota, comentario) VALUES (?, ?, ?, ?)",
            [usuario_id, livro_id, nota, comentario]
        );

        res.json({ mensagem: "Avaliações feitas com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function listarAvaliacoes(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM avaliacoes");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function obterAvaliacao(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM avaliacoes WHERE id = ?", [
            req.params.id,
        ]);
        if (rows.length === 0)
            return res.status(404).json({ erro: "Avaliação não encontrada" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function atualizarAvaliacao(req, res) {
    try {
        const { usuario_id, livro_id, nota, comentario} = req.body;
        await db.execute(
            "UPDATE livros SET usuario_id = ?, livro_id = ?, nota = ?, comentario = ?   WHERE id = ?",
            [usuario_id, livro_id, nota, comentario]
        );
        res.json({ mensagem: "Avaliação atualizada com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function deletarAvaliacao(req, res) {
    try {
        await db.execute("DELETE FROM avaliacoes WHERE id = ?", [req.params.id]);
        res.json({ mensagem: "Avaliação deletada com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};