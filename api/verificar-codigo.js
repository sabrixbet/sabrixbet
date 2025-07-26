import fs from 'fs';
import path from 'path';

const codigosPath = path.resolve(process.cwd(), 'codigos.json');
const usadosPath = path.resolve(process.cwd(), 'usados.json');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ estado: 'error', mensaje: 'Método no permitido' });
  }

  const { codigo } = req.body;

  if (!codigo) {
    return res.status(400).json({ estado: 'error', mensaje: 'Código no proporcionado' });
  }

  // Leer los códigos válidos
  const codigos = JSON.parse(fs.readFileSync(codigosPath, 'utf8'));

  // Leer los códigos ya usados
  const usados = fs.existsSync(usadosPath)
    ? JSON.parse(fs.readFileSync(usadosPath, 'utf8'))
    : {};

  // Si ya se usó el código
  if (usados[codigo]) {
    return res.json({ estado: 'usado' });
  }

  // Si el código es válido
  if (codigos[codigo]) {
    usados[codigo] = true;
    fs.writeFileSync(usadosPath, JSON.stringify(usados, null, 2));
    return res.json({ estado: 'valido', mensaje: codigos[codigo] });
  }

  // Código inválido
  return res.json({ estado: 'invalido' });
}
