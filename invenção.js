export async function listarAvaliacoes(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM avaliacoes");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};