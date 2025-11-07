import db from "../config/db.js"
export async function criarReserva(req, res) {
    try {
        const { usuario_id, livro_id, data_retirada, data_devolucao} = req.body;
        if (!usuario_id || !livro_id || !data_retirada || !data_devolucao)
            return res.status(400).json({ erro: "Campos obrigatórios" });

        await db.execute(
            "INSERT INTO reservas (usuario_id, livro_id, data_retirada, data_devolucao) VALUES (?, ?, ?, ?)",
            [usuario_id, livro_id, data_retirada, data_devolucao]
        );

        res.json({ mensagem: "Reservado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function listarRservas(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM reservas");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function deletarReserva(req, res) {
    try {
        await db.execute("DELETE FROM reservas WHERE id = ?", [req.params.id]);
        res.json({ mensagem: "Reserva cancelada com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};