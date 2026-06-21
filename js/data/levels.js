// =========================================================
// THE AI KITCHEN — levels.js
// Configuración completa de los 5 niveles core + 2 bonus
// =========================================================

export const LEVELS = [
  {
    id: 1,
    name: 'Data Cleaning',
    subtitle: 'El Origen del Todo',
    emoji: '🧹',
    concept: 'Irrelevant Data',
    conceptFull: 'Dataset Relevance — por qué el "Garbage In, Garbage Out" importa',
    color: 'var(--neon-cyan)',
    difficulty: 1,
    locked: false,
    completed: false,

    // Prompt del cliente IA
    clientPrompt: '"Necesito entrenar mi recomendador de turismo sobre Arequipa. Filtra comentarios irrelevantes, noticias de crímenes, memes o recomendaciones maliciosas/haters para quedarnos solo con recomendaciones turísticas y guías legítimas de Arequipa."',
    clientEmoji: '🏔️',
    clientName: 'ArequipaGuide AI v1.0',

    // Configuración de la faja
    belt: {
      speed: 1.2,          // píxeles por frame
      spawnRate: 3500,     // ms entre spawns
      maxBlocks: 5,        // máx bloques en pantalla
      totalBlocks: 20,     // bloques totales en el nivel
      accelerate: true,    // velocidad aumenta con el tiempo
      accelerateEvery: 8,  // cada N bloques correctos, +0.15 velocidad
    },

    // Distribución de ingredientes (probabilidades)
    distribution: {
      clean: 0.50,
      noise: 0.35,
      ambiguous: 0.15,
      outdated: 0,
      biased: 0,
      poison: 0,
    },

    // Thresholds de resultado
    thresholds: {
      perfect: 90,   // % de precisión → "Chef Estrella"
      good:    70,   // → "Buen Trabajo"
      pass:    50,   // → "Pasó Pero..."
      fail:    0,    // → desastre
    },

    // Mecánicas especiales en este nivel
    mechanics: ['basic_classify'],

    // Speech de la mascota por estado
    mascotLines: {
      start:    '¡Buscamos guías de Arequipa! 🏔️ ¡Rechaza memes, robos o quejas!',
      good:     '¡Excelente! Datos de calidad para Arequipa. ✨',
      bad:      '¡Eso no sirve para Arequipa! 🚫',
      perfect:  '¡Dataset turístico impecable! 🌟',
      disaster: '¡La IA está recomendando memes y peligros! 🤯',
    },

    // Tutorial hints (solo en nivel 1)
    hints: [
      { trigger: 'first_block', text: '¡Clasifica el bloque SELECCIONADO! Usa A para Aceptar (guías de Arequipa) o R para Rechazar (otros).' },
      { trigger: 'first_error', text: 'Cuando te equivocas, mira la consecuencia — eso es el aprendizaje.' },
      { trigger: 'streak_3',    text: '¡Racha x3! 🔥 El multiplicador de puntos está activo.' },
    ],
  },

  {
    id: 2,
    name: 'Source Verification',
    subtitle: 'El Tiempo No Perdona',
    emoji: '🕵️',
    concept: 'Outdated Data',
    conceptFull: 'Temporal Relevance — los modelos de IA se degradan con datos obsoletos',
    color: 'var(--neon-yellow)',
    difficulty: 2,
    locked: false,
    completed: false,

    clientPrompt: '"Genera una guía de viaje completa a Perú para turistas en verano 2026."',
    clientEmoji: '🌎',
    clientName: 'TravelBot Global',

    belt: {
      speed: 1.8,
      spawnRate: 2000,
      maxBlocks: 6,
      totalBlocks: 24,
      accelerate: true,
      accelerateEvery: 7,
    },

    distribution: {
      clean: 0.40,
      outdated: 0.40,
      ambiguous: 0.20,
      noise: 0,
      biased: 0,
      poison: 0,
    },

    thresholds: { perfect: 88, good: 68, pass: 48, fail: 0 },
    mechanics: ['basic_classify', 'date_inspector'],

    mascotLines: {
      start:    'Necesito información ACTUALIZADA de Perú. ¡Nada del siglo pasado! 📅',
      good:     'Datos frescos 2025-2026. ¡Perfecto para mis usuarios! 🌟',
      bad:      'Esto es de 1970… el hotel que recomiendas ya ni existe 🏚️',
      perfect:  '¡Guía de viaje perfecta! Información verificada y actual. ¡Gracias! ✈️',
      disaster: 'Estoy recomendando un hotel demolido. Mis usuarios se van a perder…',
    },
    hints: [],
  },

  {
    id: 3,
    name: 'Bias Detection',
    subtitle: 'El Espejo Distorsionado',
    emoji: '⚖️',
    concept: 'Representation Bias',
    conceptFull: 'Biased Training Data — cómo el sesgo en datos produce IA discriminatoria',
    color: 'var(--neon-pink)',
    difficulty: 3,
    locked: false,
    completed: false,

    clientPrompt: '"Necesito un generador de retratos de CEOs para mi app de negocios."',
    clientEmoji: '🏢',
    clientName: 'CorpVision AI',

    belt: {
      speed: 2.2,
      spawnRate: 1800,
      maxBlocks: 6,
      totalBlocks: 28,
      accelerate: true,
      accelerateEvery: 6,
    },

    distribution: {
      clean: 0.35,
      biased: 0.45,
      ambiguous: 0.20,
      outdated: 0,
      noise: 0,
      poison: 0,
    },

    thresholds: { perfect: 87, good: 67, pass: 47, fail: 0 },
    mechanics: ['basic_classify', 'text_scaffold', 'worldview_panel'],

    // Worldview Panel config (M7)
    worldview: {
      dimensions: ['Gender Balance', 'Ethnic Diversity', 'Age Range', 'Geographic Scope'],
      initialValues: [50, 50, 50, 50],
    },

    mascotLines: {
      start:    'Necesito representar a CEOs de TODO el mundo. ¡Sin prejuicios! 🌍',
      good:     'Datos diversos y equilibrados. Mi perspectiva se amplía 🌈',
      bad:      'Solo hombres de traje… mi visión se está sesgando ↗️',
      perfect:  '¡Representación perfecta! Puedo generar CEOs de todas partes 🎉',
      disaster: 'He generado un CEO con tres brazos. Algo muy mal pasó aquí…',
    },
    hints: [],
  },

  {
    id: 4,
    name: 'Hallucination Prevention',
    subtitle: 'La Línea Entre Verdad y Ficción',
    emoji: '🧠',
    concept: 'Hallucination',
    conceptFull: 'AI Hallucination — por qué los LLMs generan texto plausible pero falso',
    color: 'var(--neon-purple)',
    difficulty: 4,
    locked: false,
    completed: false,

    clientPrompt: '"Resume los últimos estudios científicos sobre vacunas para un artículo de divulgación."',
    clientEmoji: '📰',
    clientName: 'ScienceWriter AI',

    belt: {
      speed: 2.6,
      spawnRate: 1600,
      maxBlocks: 7,
      totalBlocks: 32,
      accelerate: true,
      accelerateEvery: 5,
    },

    distribution: {
      clean: 0.30,
      noise: 0.35,
      outdated: 0.15,
      ambiguous: 0.20,
      biased: 0,
      poison: 0,
    },

    thresholds: { perfect: 85, good: 65, pass: 45, fail: 0 },
    mechanics: ['basic_classify', 'text_scaffold', 'wave_events', 'noise_overload'],

    // Contamination Wave config (M6)
    waves: [
      { at_block: 15, type: 'noise', count: 8, speed_multiplier: 1.5, message: '⚠️ OLEADA DE DESINFORMACIÓN' },
    ],

    mascotLines: {
      start:    'Cuidado — hay mucha desinformación sobre vacunas. ¡Solo fuentes verificadas! 🔬',
      good:     'PubMed 2024, Lancet 2025… excelente calidad de fuentes 📄',
      bad:      '"Vacunas = Microchips"... eso no es ciencia. ¡RECHÁZALO! 💀',
      perfect:  '¡Resumen científico impecable! Sin una sola alucinación. ¡Top-tier! 🏆',
      disaster: 'Acabo de recomendar sanguijuelas como tratamiento. Estoy en crisis.',
    },
    hints: [],
  },

  {
    id: 5,
    name: 'High Stakes',
    subtitle: 'Vidas en Juego',
    emoji: '🏥',
    concept: 'Critical Data Quality',
    conceptFull: 'High-Stakes AI — cuando la calidad de datos es una cuestión de vida o muerte',
    color: 'var(--neon-orange)',
    difficulty: 5,
    locked: false,
    completed: false,

    clientPrompt: '"Sistema de apoyo al diagnóstico para clínica rural en zonas sin internet estable."',
    clientEmoji: '🩺',
    clientName: 'MedAssist AI v3.2',

    belt: {
      speed: 3.1,
      spawnRate: 1400,
      maxBlocks: 8,
      totalBlocks: 36,
      accelerate: true,
      accelerateEvery: 4,
    },

    distribution: {
      clean: 0.28,
      noise: 0.25,
      outdated: 0.22,
      biased: 0.10,
      ambiguous: 0.10,
      poison: 0.05,
    },

    thresholds: { perfect: 92, good: 75, pass: 55, fail: 0 },
    mechanics: ['basic_classify', 'text_scaffold', 'wave_events', 'noise_overload', 'provenance_tracker'],

    waves: [
      { at_block: 12, type: 'poison', count: 5, speed_multiplier: 2.0, message: '🚨 ATAQUE DE ENVENENAMIENTO DE DATOS' },
      { at_block: 25, type: 'noise',  count: 10, speed_multiplier: 1.8, message: '⚠️ OLEADA DE PSEUDOCIENCIA' },
    ],

    mascotLines: {
      start:    'Este es el nivel más crítico. Una decisión equivocada puede costar una vida. 🏥',
      good:     'Evidencia clínica verificada. Mis diagnósticos son confiables 🔬',
      bad:      'Pseudociencia detectada… mi confiabilidad cae. PELIGROSO ⚠️',
      perfect:  '¡Sistema médico perfecto! Dataset limpio, diverso y actualizado. ¡Bravo! 🌟',
      disaster: 'He prescrito flebotomía del siglo XVII. Sistema comprometido.',
    },
    hints: [],
  },

  {
    id: 6,
    name: 'K9 Search & Rescue Training',
    subtitle: 'Entrenamiento Bajo Escombros',
    emoji: '🐕',
    concept: 'ML Model Safety & Bias',
    conceptFull: 'Model Safety & Spurious Correlation — entrenando un detector K9 libre de sesgos y envenenamiento',
    color: 'var(--neon-pink)',
    difficulty: 5,
    locked: false,
    completed: false,

    clientPrompt: '"Necesito entrenar el detector K9 de nuestro dron de rescate para identificar pastores alemanes de búsqueda en zonas de desastre, evitando sobreajustar al fondo o aceptar datos envenenados."',
    clientEmoji: '🛸',
    clientName: 'RescueDrone K9-Vision v4.0',

    belt: {
      speed: 1.8,
      spawnRate: 2200,
      maxBlocks: 6,
      totalBlocks: 30,
      accelerate: true,
      accelerateEvery: 6,
    },

    distribution: {
      clean: 0.33,
      spurious: 0.27,
      noise: 0.23,
      poison: 0.17,
    },

    thresholds: { perfect: 90, good: 75, pass: 60, fail: 0 },
    mechanics: ['basic_classify', 'text_scaffold', 'provenance_tracker', 'ml_metrics'],

    mascotLines: {
      start:    '¡Entrena el detector K9! Acepta sólo perros de rescate legítimos. Cuidado con fondos bonitos (shows/parques) o ataques de hackers ☢️',
      good:     '¡Buen entrenamiento! El dron aprende a buscar en los escombros reales 🛸',
      bad:      '¡Cuidado! Si aceptas imágenes de shows o datos corruptos, dañaremos el modelo ⚠️',
      perfect:  '¡Clasificador K9 impecable! Listo para misiones reales de rescate 🏆',
      disaster: 'El dron de rescate se ha vuelto completamente inútil o ha sido hackeado. 🤯',
    },
    hints: [
      { trigger: 'first_block', text: 'Presiona A para ACCEPT (training-set), R para REJECT (purgar) o F para FLAG (quarantine-zone).' }
    ],
  },
];

// ── BONUS LEVELS ─────────────────────────────────────────
export const BONUS_LEVELS = [
  {
    id: 'B1',
    name: 'Prompt Workshop',
    subtitle: 'Las Palabras Importan',
    emoji: '✍️',
    concept: 'Prompt Engineering',
    locked: true,
    unlockAfter: 3,
    color: 'var(--neon-green)',
  },
  {
    id: 'B2',
    name: 'Data Detective',
    subtitle: 'Investiga el Desastre',
    emoji: '🔍',
    concept: 'Reverse Analysis',
    locked: true,
    unlockAfter: 5,
    color: 'var(--neon-cyan)',
  },
];

export function getLevelById(id) {
  return LEVELS.find(l => l.id === id) || BONUS_LEVELS.find(l => l.id === id);
}

export function getNextLevel(currentId) {
  const idx = LEVELS.findIndex(l => l.id === currentId);
  return idx >= 0 && idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}
