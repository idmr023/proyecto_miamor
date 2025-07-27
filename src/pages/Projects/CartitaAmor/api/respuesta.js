export default function handler(req, res) {
  const tipo = req.query.tipo || "desconocido";
  const fecha = new Date().toISOString();

  console.log(`[${fecha}] Respuesta registrada: ${tipo}`);

  res.status(200).send(`Recibido: ${tipo}`);
}