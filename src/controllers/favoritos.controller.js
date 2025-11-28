import db from "../src/config/db.js"
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

export async function listarFavoritosPorUsuario(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ erro: "ID do usuário é obrigatório" });
        }

        
        const [rows] = await db.execute(
            `SELECT 
                f.id as favorito_id,
                f.data_criacao,
                l.id as livro_id,
                l.titulo,
                l.autor,
                l.ano_publicacao,
                l.isbn,
                l.categoria
            FROM favoritos f
            INNER JOIN livros l ON f.livro_id = l.id
            WHERE f.usuario_id = ?
            ORDER BY f.data_criacao DESC`,
            [id]
        );

        res.json({
            usuario_id: id,
            quantidade: rows.length,
            favoritos: rows
        });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

app.use("/reservas", reservasRoutes)
app.use("/favoritos", favoritosRoutes)

import reservasRoutes from "./routes/reservas.routes.js"
import favoritosRoutes from "./routes/favoritos.routes.js"
