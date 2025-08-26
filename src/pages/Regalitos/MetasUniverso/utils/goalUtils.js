// Asigna un valor numérico a cada dificultad
const DIFICULTAD_PUNTOS = {
  facil: 1,
  intermedia: 2,
  dificil: 4,
  muy_dificil: 8,
};

// Calcula el tamaño en píxeles basado en el total de puntos
export const calcularTamañoMundo = (puntos) => {
  const baseSize = 60; // Tamaño mínimo de un planeta
  const sizePerPoint = 6; // Píxeles extra por cada punto de dificultad
  return baseSize + puntos * sizePerPoint;
};

// Agrupa las metas por año y calcula el "peso" de cada año
export const groupMetasByYear = (metas) => {
  const mundos = {};

  metas.forEach((meta) => {
    const año = meta.año === 0 ? 'agujero-negro' : meta.año.toString();
    
    if (!mundos[año]) {
      mundos[año] = {
        nombre: año,
        metas: [],
        puntosDificultad: 0,
      };
    }
    mundos[año].metas.push(meta);
    mundos[año].puntosDificultad += DIFICULTAD_PUNTOS[meta.dificultad] || 0;
  });

  return mundos;
};