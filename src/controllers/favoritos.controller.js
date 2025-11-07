import db from "../config/db.js"
export async function criarFavoritos(req, res) {
    try {
        const { usuario_id, livro_id} = req.body;
        if (!usuario_id || !livro_id )
            return res.status(400).json({ erro: "Campos obrigatórios" });

        await db.execute(
            "INSERT INTO favoritos (usuario_id, livro_id) VALUES (?, ?)",
            [usuario_id, livro_id ]
        );

        res.json({ mensagem: "Favoritado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function listarFavoritos(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM favoritos");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function deletarFavorito(req, res) {
    try {
        await db.execute("DELETE FROM favoritos WHERE id = ?", [req.params.id]);
        res.json({ mensagem: "Livro desfavoritado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};