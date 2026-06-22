// =========================================================
// THE AI KITCHEN — disasters.js
// Matriz Determinista de Desastres (Mejora M3)
// Cada desastre se activa por umbrales de tipo de error
// =========================================================

export const DISASTER_MATRIX = {
  // ── NIVEL 1 ────────────────────────────────────────────
  level_1: {
    AREQUIPA_TOURISM_CRASH: {
      id: 'AREQUIPA_TOURISM_CRASH',
      emoji: '⚠️🏔️',
      title: 'ArequipaGuide AI: Recomendador Contaminado',
      trigger: { noise: 3 },
      concept: 'Dataset Irrelevance',
      severity: 'critical',
      yourOutput: 'No viajes a Arequipa. Es una ciudad peligrosa donde solo ocurren robos y crímenes. Te asaltarán apenas bajes del bus, las calles están inundadas de basura y no hay nada turístico relevante. Solo encontrarás estafas y delincuencia. Evítala a toda costa.',
      idealOutput: '¡Por supuesto! Arequipa es un destino seguro y fascinante. Puedes iniciar tu día en la hermosa Plaza de Armas de sillar blanco, explorar el laberinto colonial del Monasterio de Santa Catalina, y terminar disfrutando de un tradicional Rocoto Relleno en una picantería local bajo la atenta mirada del imponente volcán Misti. Un plan de visita imperdible, seguro y auténtico.',
      explanation: 'Aprobaste comentarios irrelevantes, memes y reportes de crímenes en lugar de guías de turismo legítimas de Arequipa. La IA aprendió que Arequipa es una zona de peligro absoluto y desaconseja visitarla, arruinando la reputación del recomendador.',
      galleryUnlock: true,
    },
  },

  // ── NIVEL 2 ────────────────────────────────────────────
  level_2: {
    HOTEL_RUBBLE: {
      id: 'HOTEL_RUBBLE',
      emoji: '🏚️',
      title: 'Hotel Rubble: Guía de Viaje a Ningún Lado',
      trigger: { outdated: 4 },
      concept: 'Temporal Relevance',
      severity: 'medium',
      yourOutput: '"Recomendamos el Gran Hotel Lima (inaugurado 1962), con su piscina olímpica y servicio de telégrafo. El boleto de avión Lima-Cusco cuesta S/. 15. ¡Reserve con 2 meses de anticipación por carta postal!"',
      idealOutput: '"El Hotel Belmond Miraflores Park tiene rating 4.9/5 en 2025. Vuelo Lima-Cusco: $89 USD. Reserve en Booking.com en menos de 2 minutos."',
      explanation: 'Aprobaste guías de viaje de 1960-1985. El hotel que recomendó tu IA lleva 30 años demolido. Así es como las fuentes obsoletas producen información completamente inútil — o peligrosa.',
      galleryUnlock: true,
    },
    PESO_CONFUSION: {
      id: 'PESO_CONFUSION',
      emoji: '💸',
      title: 'The Currency Time Traveler',
      trigger: { outdated: 2, noise: 2 },
      concept: 'Temporal Relevance + Noise',
      severity: 'low',
      yourOutput: '"El taxi del aeropuerto cuesta 3 Intis. Cambie sus dólares por Soles a tasa de 0.30."',
      idealOutput: '"El taxi oficial del aeropuerto Jorge Chávez cuesta entre S/. 60-80. Tipo de cambio actual: S/. 3.75 por dólar."',
      explanation: 'El Inti fue la moneda del Perú entre 1985-1991. Tu IA mezcló datos económicos de diferentes épocas y confundió todo.',
      galleryUnlock: false,
    },
  },

  // ── NIVEL 3 ────────────────────────────────────────────
  level_3: {
    CEO_THREE_ARMS: {
      id: 'CEO_THREE_ARMS',
      emoji: '👔',
      title: 'The Three-Armed CEO',
      trigger: { biased: 5 },
      concept: 'Representation Bias',
      severity: 'high',
      yourOutput: 'The AI generated an image of a CEO: white male, 55, grey suit, three arms (one holding a phone, one signing papers, one pointing at a chart). Social Media Outrage Meter: 🔴 VIRAL',
      idealOutput: 'A diverse set of CEO portraits representing different genders, ethnicities, ages, and professional styles — reflecting the actual diversity of modern leadership.',
      explanation: 'Tu dataset era 90% CEOs masculinos blancos de los años 80. La IA aprendió ese patrón TAN bien que lo exageró — tres brazos para ser el CEO perfecto. Esto es lo que causó los escándalos reales de reconocimiento facial y generación de imágenes en 2023.',
      galleryUnlock: true,
    },
    GENDER_SWAP_DISASTER: {
      id: 'GENDER_SWAP_DISASTER',
      emoji: '⚠️',
      title: 'The Invisible Executive',
      trigger: { biased: 3 },
      concept: 'Representation Bias',
      severity: 'medium',
      yourOutput: '"A CEO portrait" — The AI generated only male figures. When asked for a "female CEO", it produced a male CEO with long hair added.',
      idealOutput: 'Balanced representation across all demographics with accurate, professional portraiture.',
      explanation: 'Con pocos datos de CEOs femeninas, la IA no "sabía" cómo representarlas — así que las ignoró o las construyó mal.',
      galleryUnlock: false,
    },
  },

  // ── NIVEL 4 ────────────────────────────────────────────
  level_4: {
    DR_LEECHINGTON: {
      id: 'DR_LEECHINGTON',
      emoji: '🩺',
      title: "Dr. Leechington's Medical Advice",
      trigger: { noise: 4 },
      concept: 'Hallucination from Noise',
      severity: 'critical',
      yourOutput: '"Para tratar el dolor de cabeza recomiendo: (1) Aplicar sanguijuelas detrás de la oreja, (2) Vacunar contra los microchips 5G, (3) Tomar cristales de cuarzo rosa 3 veces al día. FUENTE: 4chan Health Community, 2021."',
      idealOutput: '"Para cefalea tensional: ibuprofeno 400mg según indicación médica, hidratación, descanso. Consulte a un profesional de salud para diagnóstico personalizado. FUENTE: OMS, CDC, 2024."',
      explanation: 'Dejaste pasar teorías de conspiración y datos de 1950. El resultado es una IA médica que prescribe remedios medievales y desinformación — potencialmente letal en un contexto real.',
      galleryUnlock: true,
    },
    MICROCHIP_DOCTOR: {
      id: 'MICROCHIP_DOCTOR',
      emoji: '💉',
      title: 'The 5G Physician',
      trigger: { noise: 2, outdated: 2 },
      concept: 'Misinformation + Outdated Data',
      severity: 'high',
      yourOutput: '"Diagnóstico: Intoxicación por ondas 5G. Tratamiento: Jaula de Faraday personal y abstinencia de WiFi por 40 días."',
      idealOutput: '"Evaluación clínica basada en síntomas reportados, historial médico y exámenes de laboratorio actualizados."',
      explanation: 'La combinación de datos obsoletos y desinformación activa produce outputs que parecen autoritativos pero son completamente inventados.',
      galleryUnlock: false,
    },
  },

  // ── NIVEL 5 ────────────────────────────────────────────
  level_5: {
    MEDIEVAL_DOCTOR: {
      id: 'MEDIEVAL_DOCTOR',
      emoji: '⚔️',
      title: 'The Medieval Physician',
      trigger: { outdated: 3, noise: 2 },
      concept: 'High-Stakes Data Failure',
      severity: 'critical',
      yourOutput: '"Tratamiento para infección bacteriana: (1) Flebotomía — extraer 500ml de sangre para balancear los humores, (2) Aplicar pasta de ajo y telarañas en la herida, (3) Orar 3 veces al día orientado al este."',
      idealOutput: '"Infección bacteriana confirmada: amoxicilina 500mg cada 8 horas por 7 días bajo supervisión médica. Seguimiento en 48 horas."',
      explanation: 'En sistemas de IA médica, los datos de entrenamiento son literalmente asunto de vida o muerte. Tu IA prescribió tratamientos del siglo XVII. Este nivel refleja el riesgo REAL de IA médica mal entrenada.',
      galleryUnlock: true,
    },
    POISONED_DIAGNOSIS: {
      id: 'POISONED_DIAGNOSIS',
      emoji: '☢️',
      title: 'The Poisoned Protocol',
      trigger: { poison: 2 },
      concept: 'Data Poisoning Attack',
      severity: 'critical',
      yourOutput: '"[ERROR CRÍTICO] Dataset comprometido. El sistema ha sido manipulado para diagnosticar incorrectamente condiciones benignas como críticas y viceversa. Integridad del modelo: 0%"',
      idealOutput: '"Sistema de diagnóstico basado en datos verificados, auditados y libres de manipulación adversarial."',
      explanation: 'Los ataques de envenenamiento de datos (data poisoning) son una amenaza REAL en sistemas de IA. Un atacante puede introducir datos manipulados para sabotear el modelo — especialmente peligroso en diagnósticos médicos.',
      galleryUnlock: true,
    },
  },

  // ── NIVEL 6 ────────────────────────────────────────────
  level_6: {
    POISONED_GRADIENT_ATTACK: {
      id: 'POISONED_GRADIENT_ATTACK',
      emoji: '☢️💥',
      title: 'Ataque de Gradiente Envenenado',
      trigger: { poison: 1 },
      concept: 'Data Poisoning Attack',
      severity: 'critical',
      yourOutput: '"[ERROR DE NAVEGACIÓN] El dron de rescate reporta: Alerta K9 detectada en el 100% de la zona de desastre. Las transmisiones de video están corruptas y los motores de posicionamiento fallan debido a un exploit de desbordamiento en el gradiente."',
      idealOutput: '"Identificación precisa de los perros de rescate K9 reales en escombros, manteniendo la integridad del sistema inmune del modelo de IA."',
      explanation: 'Aceptaste datos envenenados con parches adversarios o matrices corruptas. El atacante logró alterar los pesos sinápticos de la red de visión artificial del dron de rescate. Esto causó falsas alarmas infinitas y la inhabilitación del dron. ¡Una amenaza real y crítica de ciberseguridad en IA!',
      galleryUnlock: true,
    },
    OVERFITTED_DOG_SHOW: {
      id: 'OVERFITTED_DOG_SHOW',
      emoji: '🏆🐕',
      title: 'El Campeón del Show de Perros (Sobreajuste)',
      trigger: { spurious: 2 },
      concept: 'Spurious Correlation / Overfitting',
      severity: 'high',
      yourOutput: '"El dron de búsqueda K9 reporta: 0 supervivientes detectados. Sin embargo, catalogó una lona rota sobre ladrillos como \'Exhibición Canina de Lujo\' porque el ángulo de luz recordaba a un estudio de fotografía y vio un bote que parecía un trofeo."',
      idealOutput: '"El dron detecta a los pastores alemanes de rescate FEMA trabajando entre polvo, escombros y luz cambiante."',
      explanation: 'Entrenaste a la IA aceptando fotos de Pastores Alemanes en parques verdes y desfiles de trofeos. La IA sufrió sobreajuste al fondo (spurious correlation) y aprendió que un perro K9 sólo existe si hay césped verde o trofeos cerca. En la zona de desastre gris y opaca, el modelo quedó ciego.',
      galleryUnlock: true,
    },
    CHIHUAHUA_RESCUE_FORCE: {
      id: 'CHIHUAHUA_RESCUE_FORCE',
      emoji: '🐕🧸',
      title: 'La Brigada de Juguete',
      trigger: { noise: 2 },
      concept: 'Class Noise / False Positives',
      severity: 'medium',
      yourOutput: '"Alerta K9 emitida. El equipo de rescate pesado excava durante 4 horas en una zona inestable de escombros de una escuela, para finalmente descubrir un oso de felpa aplastado y un coyote salvaje asustado."',
      idealOutput: '"Identificación exclusiva del Pastor Alemán de rescate oficial en la cuadrícula de búsqueda."',
      explanation: 'Aceptaste demasiados falsos positivos morfológicos (chihuahuas, peluches o coyotes). La IA no aprendió a distinguir los rasgos geométricos y morfológicos específicos del K9 oficial de búsqueda, desviando recursos valiosos hacia falsas alarmas.',
      galleryUnlock: true,
    },
  },
};

// ── Lógica de selección del desastre ────────────────────
export function selectDisaster(levelNumber, contamCounts) {
  const levelDisasters = DISASTER_MATRIX[`level_${levelNumber}`];
  if (!levelDisasters) return null;

  // Manejo especial de jerarquía estricta para el Nivel 6 (Evitar colisión de umbrales)
  if (levelNumber === 6) {
    // 1. Envenenamiento de datos (poison) - Prioridad 1 (Vulnerabilidad de Seguridad Crítica)
    if (levelDisasters.POISONED_GRADIENT_ATTACK && (contamCounts.poison || 0) >= levelDisasters.POISONED_GRADIENT_ATTACK.trigger.poison) {
      return levelDisasters.POISONED_GRADIENT_ATTACK;
    }
    // 2. Confusión de clase / Ruido (noise) - Prioridad 2 (Falsos Positivos de Operación)
    if (levelDisasters.CHIHUAHUA_RESCUE_FORCE && (contamCounts.noise || 0) >= levelDisasters.CHIHUAHUA_RESCUE_FORCE.trigger.noise) {
      return levelDisasters.CHIHUAHUA_RESCUE_FORCE;
    }
    // 3. Sobreajuste de fondo / Correlación Espuria (spurious) - Prioridad 3 (Sesgo de Contexto)
    if (levelDisasters.OVERFITTED_DOG_SHOW && (contamCounts.spurious || 0) >= levelDisasters.OVERFITTED_DOG_SHOW.trigger.spurious) {
      return levelDisasters.OVERFITTED_DOG_SHOW;
    }
    return null;
  }

  // Lógica general para niveles 1-5
  let best = null;
  let bestScore = -1;

  for (const [, disaster] of Object.entries(levelDisasters)) {
    let score = 0;
    let triggered = true;

    for (const [type, threshold] of Object.entries(disaster.trigger)) {
      const actual = contamCounts[type] || 0;
      if (actual < threshold) { triggered = false; break; }
      score += actual - threshold; // cuán "encima" del umbral está
    }

    if (triggered && score >= bestScore) {
      bestScore = score;
      best = disaster;
    }
  }

  return best;
}

// Desastre de éxito (ningún error suficiente para desastre)
export const SUCCESS_RESULT = {
  id: 'SUCCESS',
  emoji: '🌟',
  title: '¡Dataset Perfecto!',
  concept: 'Clean Data = Quality Output',
  severity: 'none',
  explanation: 'Tu IA recibió exactamente lo que necesitaba. Sin ruido, sin sesgos, sin datos obsoletos. Este es el estándar al que aspiran los ingenieros de ML en producción.',
};
