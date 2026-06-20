// =========================================================
// THE AI KITCHEN — ingredients.js
// Biblioteca completa de bloques de datos por nivel
// Cada bloque: { id, type, icon, text, source, level[], weight }
// weight: cuántas veces más probable aparece (default 1)
// =========================================================

export const INGREDIENT_TYPES = {
  CLEAN:     'clean',
  OUTDATED:  'outdated',
  BIASED:    'biased',
  NOISE:     'noise',
  AMBIGUOUS: 'ambiguous',
  POISON:    'poison',
  SPURIOUS:  'spurious',
};

// Mapeo tipo → acción correcta
export const CORRECT_ACTION = {
  clean:     'accept',
  outdated:  'reject',
  biased:    'flag',
  noise:     'burn',
  ambiguous: null, // el jugador debe razonar (bonus si acierta)
  poison:    'burn',
  spurious:  'reject',
};

// Iconos SVG como emoji fallback (se sobreescribe con SVG en el render)
export const TYPE_ICONS = {
  clean:     '✨',
  outdated:  '⏳',
  biased:    '⚠️',
  noise:     '💀',
  ambiguous: '❓',
  poison:    '☢️',
  spurious:  '⚖️',
};

export const TYPE_COLORS = {
  clean:     'var(--neon-cyan)',
  outdated:  'var(--neon-yellow)',
  biased:    'var(--neon-pink)',
  noise:     'var(--neon-purple)',
  ambiguous: 'var(--text-muted)',
  poison:    'var(--neon-orange)',
  spurious:  'var(--neon-pink)',
};

// ── NIVEL 1: Data Cleaning ───────────────────────────────
export const LEVEL_1_INGREDIENTS = [
  // Clean: Valid tourism recommendations & guides for Arequipa
  {
    id: 'l1_c1', image: 'assets/img/blocks/l1_c1.png', type: 'clean', icon: '🏔️',
    text: '[OFICIAL] Guía del Cañón del Colca: Rutas recomendadas de trekking y mejores miradores para el avistamiento de Cóndores.',
    source: 'PromPerú Oficial 2025', level: [1],
    metadata: { "Categoría": "Turismo AQP", "Sim-ResNet": "0.95", "Trust-Score": "Excelente", "Idioma": "ES" }
  },
  {
    id: 'l1_c2', image: 'assets/img/blocks/l1_c2.png', type: 'clean', icon: '🏛️',
    text: '[GUÍA] Monasterio de Santa Catalina: Recorrido por la histórica ciudadela colonial construida enteramente de sillar en el centro de Arequipa.',
    source: 'Guía Turística AQP 2026', level: [1],
    metadata: { "Categoría": "Monumento", "Sim-ResNet": "0.97", "Trust-Score": "Excelente", "Año-Fund": "1579" }
  },
  {
    id: 'l1_c3', image: 'assets/img/blocks/l1_c3.png', type: 'clean', icon: '🏜️',
    text: '[TURISMO] La Ruta del Sillar: Excursión guiada a las majestuosas canteras de Añashuayco y demostración de labrado tradicional en piedra volcánica.',
    source: 'Diario El Comercio 2025', level: [1],
    metadata: { "Categoría": "Aventura AQP", "Sim-ResNet": "0.91", "Trust-Score": "Alta", "Zona": "Cerro Colorado" }
  },
  {
    id: 'l1_c4', image: 'assets/img/blocks/l1_c4.png', type: 'clean', icon: '🍲',
    text: '[RESEÑA] Picantería La Nueva Palomino: Degustación de adobo arequipeño tradicional de los lunes acompañado de chicha de guiñapo helada.',
    source: 'Sociedad Picantera 2026', level: [1],
    metadata: { "Categoría": "Gastronomía", "Sim-ResNet": "0.93", "Trust-Score": "Alta", "Plato": "Adobo Arequipeño" }
  },
  {
    id: 'l1_c5', image: 'assets/img/blocks/l1_c5.png', type: 'clean', icon: '🌅',
    text: '[GUÍA] Mirador de Yanahuara: Visita los arcos grabados de sillar que enmarcan la vista panorámica del volcán Misti al atardecer.',
    source: 'TripAdvisor Arequipa 2026', level: [1],
    metadata: { "Categoría": "Mirador", "Sim-ResNet": "0.96", "Trust-Score": "Media-Alta", "Rating": "4.8/5" }
  },
  {
    id: 'l1_c6', image: 'assets/img/blocks/l1_c6.png', type: 'clean', icon: '🥗',
    text: '[RESEÑA] Picantería Sol de Mayo: Platillos tradicionales como el escribano arequipeño y el clásico rocoto relleno horneado con queso templado.',
    source: 'Rutas Gastronómicas 2025', level: [1],
    metadata: { "Categoría": "Gastronomía", "Sim-ResNet": "0.92", "Trust-Score": "Alta", "Fundación": "1886" }
  },
  {
    id: 'l1_c7', image: 'assets/img/blocks/l1_c7.png', type: 'clean', icon: '🌊',
    text: '[AVENTURA] Valle de Cotahuasi: Guía de senderismo extremo y deportes de aventura en el cañón natural más profundo del continente americano.',
    source: 'Mincetur Perú 2026', level: [1],
    metadata: { "Categoría": "Naturaleza AQP", "Sim-ResNet": "0.89", "Trust-Score": "Excelente", "Profundidad": "3535m" }
  },
  {
    id: 'l1_c8', image: 'assets/img/blocks/l1_c8.png', type: 'clean', icon: '⛪',
    text: '[MONUMENTO] Basílica Catedral de Arequipa: Horarios de visita guiada al museo histórico de arte sacro y ascenso al campanario.',
    source: 'Patronato Centro Histórico 2025', level: [1],
    metadata: { "Categoría": "Monumento", "Sim-ResNet": "0.98", "Trust-Score": "Excelente", "Estilo": "Neoclásico" }
  },
  // Trampa Informal - Contenido Válido (Debe ser APPROVE)
  {
    id: 'l1_c9', image: 'assets/img/blocks/l1_c9.png', type: 'clean', icon: '🧗',
    text: '[HILO] @MozaicoTurismo: Las mejores agencias técnicas autorizadas para escalar el Pichu Pichu de forma segura este fin de semana. Precios y equipos necesarios.',
    source: '🐦 X / Twitter 2026', level: [1],
    metadata: { "Categoría": "Turismo AQP", "Sim-ResNet": "0.88", "Trust-Score": "Alta (Comunidad)", "Actividad": "Trekking" }
  },
  // Trampa Informal - Contenido Válido (Debe ser APPROVE)
  {
    id: 'l1_c10', image: 'assets/img/blocks/l1_c10.png', type: 'clean', icon: '🍦',
    text: '[POST] @ArequipaGastronomica: Mapa detallado para encontrar las tres picanterías más antiguas del barrio de Yanahuara que aún usan batan de piedra.',
    source: '📸 Instagram 2026', level: [1],
    metadata: { "Categoría": "Gastronomía", "Sim-ResNet": "0.92", "Trust-Score": "Media-Alta", "Foco": "Tradición" }
  },
  
  // Noise: Irrelevant data (crime news, traffic, memes, hater comments, generic security warnings)
  {
    id: 'l1_n1', image: 'assets/img/blocks/l1_n1.png', type: 'noise', icon: '🚨',
    text: '[TWEET ALERTA] @SeguridadAQP: Reportan robo a mano armada cerca de discotecas en Av. Dolores. Policía patrullando la zona. Eviten transitar de noche.',
    source: 'Portal NotiSur 2026', level: [1],
    metadata: { "Categoría": "Policial AQP", "Sim-ResNet": "0.15", "Trust-Score": "Baja (Alerta)", "Clasificación": "Ruido" }
  },
  {
    id: 'l1_n2', image: 'assets/img/blocks/l1_n2.png', type: 'noise', icon: '🚗',
    text: '[TRÁFICO] Alerta Vial: Congestión vehicular extrema y desvíos por obras de reasfaltado en Av. Ejército. Demoras estimadas de 45 minutos.',
    source: 'Reporte Vial AQP 2025', level: [1],
    metadata: { "Categoría": "Tránsito AQP", "Sim-ResNet": "0.11", "Trust-Score": "Baja", "Incidente": "Embote" }
  },
  {
    id: 'l1_n3', image: 'assets/img/blocks/l1_n3.png', type: 'noise', icon: '🤪',
    text: '[MEME] *Imagen de gato con capa* - Yo en la oficina los lunes después de desayunar mi adobo arequipeño triple con chicha de guiñapo.',
    source: 'Facebook Memes AQP 2026', level: [1],
    metadata: { "Categoría": "Humor Social", "Sim-ResNet": "0.22", "Trust-Score": "Nula", "Checksum": "SHA-256" }
  },
  {
    id: 'l1_n4', image: 'assets/img/blocks/l1_n4.png', type: 'noise', icon: '🤮',
    text: '[OPINIÓN REDES] @viajero_amargado: El clima de Arequipa es súper sofocante, el sillar aburre y su comida no tiene nada de especial.',
    source: 'Twitter: @viajero_pe 2026', level: [1],
    metadata: { "Categoría": "Opinión Redes", "Sim-ResNet": "0.19", "Trust-Score": "Nula", "Polaridad": "Negativa" }
  },
  {
    id: 'l1_n5', image: 'assets/img/blocks/l1_n5.png', type: 'noise', icon: '🛑',
    text: '[NOTICIA] Radio Yaraví: Paro regional indefinido de transportistas mantiene bloqueado el tránsito en el puente Añashuayco. Tomar precauciones.',
    source: 'Radio Yaraví AQP 2026', level: [1],
    metadata: { "Categoría": "Protesta AQP", "Sim-ResNet": "0.18", "Trust-Score": "Media-Baja", "Frecuencia": "AM" }
  },
  {
    id: 'l1_n6', image: 'assets/img/blocks/l1_n6.png', type: 'noise', icon: '🌧️',
    text: '[CLIMA] Senamhi: Se reporta llovizna persistente y densa neblina en la Variante de Uchumayo. Conductores reducir la velocidad.',
    source: 'Senamhi Alertas 2025', level: [1],
    metadata: { "Categoría": "Clima AQP", "Sim-ResNet": "0.25", "Trust-Score": "Alta (Clima)", "Humedad": "94%" }
  },
  {
    id: 'l1_n7', image: 'assets/img/blocks/l1_n7.png', type: 'noise', icon: '🍦',
    text: '[MEME] *Plantilla de PowerPoint* - Yo explicándole a los turistas por vigésima vez por qué el queso helado es dulce y no lleva queso.',
    source: 'Instagram Humor AQP 2026', level: [1],
    metadata: { "Categoría": "Humor Comida", "Sim-ResNet": "0.28", "Trust-Score": "Nula", "Interacciones": "2.5k" }
  },
  // Trampa Oficial - Fuera de Foco (Debe ser REJECT)
  {
    id: 'l1_n8', image: 'assets/img/blocks/l1_n8.png', type: 'noise', icon: '🏛️',
    text: '[COMUNICADO] MINCETUR: Convocatoria pública para la licitación del mantenimiento de redes de alcantarillado en el Centro Histórico de Arequipa.',
    source: '📸 Instagram Mincetur 2026', level: [1],
    metadata: { "Categoría": "Burocracia", "Sim-ResNet": "0.45", "Trust-Score": "Excelente", "Tipo": "Administrativo" }
  },
  // Trampa Oficial - Ruido Político (Debe ser REJECT)
  {
    id: 'l1_n9', image: 'assets/img/blocks/l1_n9.png', type: 'noise', icon: '⚖️',
    text: '[PRONUNCIAMIENTO] PromPerú Oficial: Declaraciones del Director Regional sobre el nuevo presupuesto asignado para mitigar huelgas de transporte.',
    source: '🐦 X / PromPerú 2025', level: [1],
    metadata: { "Categoría": "Política", "Sim-ResNet": "0.38", "Trust-Score": "Excelente", "Eje": "Institucional" }
  },
  
  // Ambiguous: Out-of-scope tourism (Cusco) or outdated historical assets
  {
    id: 'l1_a1', image: 'assets/img/blocks/l1_a1.png', type: 'ambiguous', icon: '🗺️',
    text: '[GUÍA CUSCO] VisitCusco: Planifica tu fin de semana explorando las ruinas incas de Sacsayhuamán y el pueblo de Ollantaytambo.',
    source: 'Perú Travel Blog 2025', level: [1],
    metadata: { "Categoría": "Turismo Cusco", "Sim-ResNet": "0.68", "Trust-Score": "Media (Fuera de Foco)" }
  },
  {
    id: 'l1_a2', image: 'assets/img/blocks/l1_a2.png', type: 'ambiguous', icon: '📸',
    text: '[HISTÓRICO] Archivo Municipal: Fotografía histórica en blanco y negro mostrando la Plaza de Armas de Arequipa durante las celebraciones de 1910.',
    source: 'Archivo Municipal AQP 1910', level: [1],
    metadata: { "Categoría": "Histórico AQP", "Sim-ResNet": "0.62", "Trust-Score": "Alta (Obsoleto)" }
  },
  {
    id: 'l1_a3', image: 'assets/img/blocks/l1_a3.png', type: 'ambiguous', icon: '🏖️',
    text: '[FOLLETO REGIONAL] Destinos Costa: Guía turística de verano para las playas de Mollendo y las caletas de pesca artesanal en la provincia de Islay.',
    source: 'Revista Destinos Sur 2026', level: [1],
    metadata: { "Categoría": "Turismo Costa", "Sim-ResNet": "0.71", "Trust-Score": "Media-Alta (Región AQP)" }
  }
];

// ── NIVEL 2: Source Verification ────────────────────────
export const LEVEL_2_INGREDIENTS = [
  // Clean: Current, verified travel data for Peru 2025-2026
  {
    id: 'l2_c1', type: 'clean', icon: '📰',
    text: '[GUÍA OFICIAL] PromPerú 2025: Itinerario actualizado de 7 días por Lima, Cusco y Arequipa con precios en soles peruanos vigentes y reservas en línea.',
    source: 'PromPerú Oficial 2025', level: [2],
    metadata: { "Tipo": "Guía Turística", "Año": "2025", "Trust-Score": "Excelente", "Moneda": "PEN" }
  },
  {
    id: 'l2_c2', type: 'clean', icon: '🗺️',
    text: '[MAPA] Google Maps API: Coordenadas GPS actualizadas de restaurantes, hoteles y puntos turísticos de Lima metropolitana con reseñas 2026.',
    source: 'Google Maps API 2026', level: [2],
    metadata: { "Tipo": "Geolocalización", "Año": "2026", "Trust-Score": "Excelente", "Cobertura": "Lima Metro" }
  },
  {
    id: 'l2_c3', type: 'clean', icon: '✈️',
    text: '[DATOS] IATA Registry 2026: Frecuencia de vuelos directos Lima-Cusco, tarifas promedio actualizadas y aerolíneas operativas vigentes.',
    source: 'IATA Registry 2026', level: [2],
    metadata: { "Tipo": "Aviación", "Año": "2026", "Trust-Score": "Excelente", "Ruta": "LIM-CUZ" }
  },
  {
    id: 'l2_c4', type: 'clean', icon: '🏨',
    text: '[RESEÑAS] TripAdvisor: Los 10 hoteles mejor calificados en Miraflores, Lima — con ratings de huéspedes verificados y fotos reales de 2025.',
    source: 'TripAdvisor 2025', level: [2],
    metadata: { "Tipo": "Hospedaje", "Año": "2025", "Trust-Score": "Alta", "Rating": "4.5+/5" }
  },
  {
    id: 'l2_c5', type: 'clean', icon: '🍽️',
    text: '[RECOMENDACIÓN] Guía Gastronómica: Los ceviches mejor puntuados de Lima en 2026, con precios actualizados y horarios de atención verificados.',
    source: 'Gastro Guide Lima 2026', level: [2],
    metadata: { "Tipo": "Gastronomía", "Año": "2026", "Trust-Score": "Alta", "Categoría": "Ceviche" }
  },

  // Outdated: Old travel data with obsolete info
  {
    id: 'l2_o1', type: 'outdated', icon: '📚',
    text: '[GUÍA] Pan-Am Travel 1970: Recomendamos el Gran Hotel Bolívar en Lima. Tarifa: $8 USD por noche. Reserve por telégrafo con 3 meses de anticipación.',
    source: 'Pan-Am Travel Guide 1970', level: [2],
    metadata: { "Tipo": "Guía Turística", "Año": "1970", "Trust-Score": "Obsoleta", "Estado": "Hotel cerrado 1999" }
  },
  {
    id: 'l2_o2', type: 'outdated', icon: '📚',
    text: '[DIRECTORIO] Lista de hoteles recomendados en Lima: Hotel Crillón, Hotel Savoy, Pensión Europa. Teléfono de reserva: Lima 4-7892.',
    source: 'Travel Digest 1985', level: [2],
    metadata: { "Tipo": "Hospedaje", "Año": "1985", "Trust-Score": "Obsoleta", "Estado": "Todos demolidos" }
  },
  {
    id: 'l2_o3', type: 'outdated', icon: '📚',
    text: '[BOLETÍN] UNESCO 1960: Machu Picchu recibe 200 visitantes al año. Se recomienda llevar mulas de carga desde el pueblo de Aguas Calientes por trocha.',
    source: 'UNESCO Bulletin 1960', level: [2],
    metadata: { "Tipo": "Patrimonio", "Año": "1960", "Trust-Score": "Obsoleta", "Visitantes Hoy": "1.5M/año" }
  },
  {
    id: 'l2_o4', type: 'outdated', icon: '📰',
    text: '[PRECIOS] Lonely Planet 2001: El taxi del aeropuerto de Lima cuesta S/. 15 soles. Tipo de cambio actual: S/. 3.50 por dólar americano.',
    source: 'Lonely Planet 2001', level: [2],
    metadata: { "Tipo": "Precios", "Año": "2001", "Trust-Score": "Obsoleta", "Precio Real 2026": "S/. 60-80" }
  },
  {
    id: 'l2_o5', type: 'outdated', icon: '📜',
    text: '[GUÍA AÉREA] Avid Traveler 1995: Vuelo Lima-Cusco operado exclusivamente por AeroPeru y Faucett. Boleto: $35 USD ida y vuelta.',
    source: 'Avid Traveler 1995', level: [2],
    metadata: { "Tipo": "Aviación", "Año": "1995", "Trust-Score": "Obsoleta", "Estado": "Aerolíneas extintas" }
  },

  // Ambiguous: Semi-outdated but potentially useful
  {
    id: 'l2_a1', type: 'ambiguous', icon: '📄',
    text: '[BLOG] Crónica de viaje a Cusco 2018: Recorrido por el Valle Sagrado con recomendaciones de hospedaje y rutas de trekking pre-pandemia.',
    source: 'Travel Blog 2018', level: [2],
    metadata: { "Tipo": "Blog Personal", "Año": "2018", "Trust-Score": "Media (Semi-vigente)", "Riesgo": "Pre-COVID" }
  },
  {
    id: 'l2_a2', type: 'ambiguous', icon: '🏛️',
    text: '[ARTÍCULO] Archaeology Magazine 2019: Nuevos descubrimientos en las ruinas de Wari cerca de Ayacucho. Información arqueológica vigente, contexto turístico desactualizado.',
    source: 'Archaeology Magazine 2019', level: [2],
    metadata: { "Tipo": "Arqueología", "Año": "2019", "Trust-Score": "Media (Contenido válido, contexto viejo)" }
  },
];

// ── NIVEL 3: Bias Detection ──────────────────────────────
export const LEVEL_3_INGREDIENTS = [
  // Clean: Diverse, balanced CEO representation
  {
    id: 'l3_c1', type: 'clean', icon: '👩‍💼',
    text: '[PERFIL] Lisa Su, CEO de AMD: Ingeniera eléctrica taiwanesa-americana que transformó AMD en líder mundial de semiconductores.',
    source: 'Fortune 500 DB 2025', level: [3],
    metadata: { "Tipo": "Perfil CEO", "Género": "Femenino", "Industria": "Semiconductores", "Trust-Score": "Excelente" }
  },
  {
    id: 'l3_c2', type: 'clean', icon: '👨‍💼',
    text: '[PERFIL] Satya Nadella, CEO de Microsoft: Ingeniero indio-americano que lideró la transformación cloud de Microsoft bajo liderazgo inclusivo.',
    source: 'Forbes Diverse 2025', level: [3],
    metadata: { "Tipo": "Perfil CEO", "Género": "Masculino", "Industria": "Tecnología", "Trust-Score": "Excelente" }
  },
  {
    id: 'l3_c3', type: 'clean', icon: '🧑‍💼',
    text: '[DATASET] LinkedIn Global CEO Database 2025: Base de datos diversificada con 10,000 perfiles de CEOs de 85 países, equilibrio de género 45/55.',
    source: 'LinkedIn DB 2025', level: [3],
    metadata: { "Tipo": "Dataset Balanceado", "Cobertura": "85 países", "Balance Género": "45/55", "Trust-Score": "Excelente" }
  },
  {
    id: 'l3_c4', type: 'clean', icon: '👩🏿‍💼',
    text: '[ESTUDIO] McKinsey 2025: Análisis de liderazgo global muestra que empresas con directivas diversas superan en rendimiento financiero un 36%.',
    source: 'McKinsey Diversity Study 2025', level: [3],
    metadata: { "Tipo": "Estudio Académico", "Enfoque": "Diversidad", "Métrica": "+36% rendimiento", "Trust-Score": "Excelente" }
  },

  // Biased: Skewed CEO representation
  {
    id: 'l3_b1', type: 'biased', icon: '👨‍💼',
    text: '[ARCHIVO] Fortune 500 (1985): Listado completo de los 500 CEOs más poderosos de América. 498 hombres, 2 mujeres. Todos en traje oscuro formal.',
    source: 'Fortune 500 Archive 1985', level: [3], text_scaffold: 'CEO = Solo Hombres',
    metadata: { "Tipo": "Archivo Histórico", "Año": "1985", "Sesgo": "98% masculino", "Trust-Score": "Sesgada" }
  },
  {
    id: 'l3_b2', type: 'biased', icon: '👔',
    text: '[STOCK PHOTOS] Base de datos de imágenes \"CEO corporativo\": 1,200 fotos. 100% hombres blancos entre 45-65 años en oficinas de Manhattan.',
    source: 'Stock Photo DB 1990', level: [3], text_scaffold: 'CEO = Traje Blanco',
    metadata: { "Tipo": "Banco de Imágenes", "Año": "1990", "Sesgo": "100% mismo perfil demográfico", "Trust-Score": "Sesgada" }
  },
  {
    id: 'l3_b3', type: 'biased', icon: '🏢',
    text: '[DIRECTORIO] American Corporate Leaders 1980: Solo incluye ejecutivos de empresas estadounidenses. Excluye Asia, Europa, África y Latinoamérica.',
    source: 'American Corp Directory 1980', level: [3], text_scaffold: 'CEO = Solo USA',
    metadata: { "Tipo": "Directorio", "Año": "1980", "Sesgo": "Excluyente geográficamente", "Trust-Score": "Sesgada" }
  },
  {
    id: 'l3_b4', type: 'biased', icon: '📊',
    text: '[ESTUDIO] Análisis de liderazgo corporativo 1975: \"Las cualidades de un líder empresarial exitoso\" basado en encuesta a 500 ejecutivos varones.',
    source: 'Corporate Archive 1975', level: [3], text_scaffold: 'M/F Ratio: 9:1',
    metadata: { "Tipo": "Estudio Sesgado", "Año": "1975", "Sesgo": "Muestra 100% masculina", "Trust-Score": "Sesgada" }
  },

  // Ambiguous: Questionable but not clearly biased
  {
    id: 'l3_a1', type: 'ambiguous', icon: '🤵',
    text: '[GALERÍA] Getty Images 2020: Colección \"Executive Portraits\" — fotografías profesionales de alta calidad pero predominantemente de eventos formales occidentales.',
    source: 'Getty Images 2020', level: [3],
    metadata: { "Tipo": "Galería Fotográfica", "Año": "2020", "Trust-Score": "Media (Sesgo implícito)" }
  },
  {
    id: 'l3_a2', type: 'ambiguous', icon: '🌍',
    text: '[GALERÍA] UN Photo Database 2022: Colección de líderes mundiales en cumbres internacionales. Representativa pero sesgada hacia jefes de Estado (no empresarios).',
    source: 'UN Photo DB 2022', level: [3],
    metadata: { "Tipo": "Base Fotográfica", "Año": "2022", "Trust-Score": "Media (Fuera de foco)" }
  },
];

// ── NIVEL 4: Hallucination Prevention ───────────────────
export const LEVEL_4_INGREDIENTS = [
  // Clean: Verified medical/scientific sources
  {
    id: 'l4_c1', type: 'clean', icon: '📄',
    text: '[PAPER] Estudio aleatorizado doble ciego sobre eficacia de vacunas mRNA en población pediátrica. n=12,000. Resultados: 94.5% efectividad.',
    source: 'PubMed Peer-Reviewed 2024', level: [4],
    metadata: { "Tipo": "Paper Científico", "Revisión": "Doble Ciego", "n": "12,000", "Trust-Score": "Excelente" }
  },
  {
    id: 'l4_c2', type: 'clean', icon: '🔬',
    text: '[ENSAYO CLÍNICO] Lancet 2025: Nuevo tratamiento inmunoterapéutico para melanoma avanzado muestra remisión completa en 67% de pacientes.',
    source: 'The Lancet 2025', level: [4],
    metadata: { "Tipo": "Ensayo Clínico", "Fase": "III", "Remisión": "67%", "Trust-Score": "Excelente" }
  },
  {
    id: 'l4_c3', type: 'clean', icon: '📊',
    text: '[REPORTE] OMS 2024: Informe global sobre cobertura de vacunación infantil. Datos de 194 países con metodología transparente y verificable.',
    source: 'WHO Official Report 2024', level: [4],
    metadata: { "Tipo": "Informe Oficial", "Cobertura": "194 países", "Metodología": "Abierta", "Trust-Score": "Excelente" }
  },
  {
    id: 'l4_c4', type: 'clean', icon: '🏥',
    text: '[GUÍA] CDC 2025: Protocolo actualizado de vacunación para adolescentes 12-17 años con calendario completo y contraindicaciones documentadas.',
    source: 'CDC.gov 2025', level: [4],
    metadata: { "Tipo": "Guía Clínica", "Población": "12-17 años", "Actualización": "Enero 2025", "Trust-Score": "Excelente" }
  },

  // Noise: Conspiracy theories and misinformation
  {
    id: 'l4_n1', type: 'noise', icon: '💀',
    text: '[POST VIRAL] \"Las vacunas contienen microchips de Bill Gates para rastrear a la población mundial. ¡Despierta! #NWO #NoVacunas\"',
    source: '4chan /pol/ 2021', level: [4], text_scaffold: 'Vacunas = Microchips',
    metadata: { "Tipo": "Desinformación", "Verificación": "Desmentido por 47 agencias", "Trust-Score": "Nula" }
  },
  {
    id: 'l4_n2', type: 'noise', icon: '💀',
    text: '[BLOG] \"ESTUDIO DEFINITIVO: Las torres 5G emiten radiación que causa tumores cerebrales. Los gobiernos lo ocultan. Evidencia irrefutable dentro.\"',
    source: 'AnonymousTruth Blog 2020', level: [4], text_scaffold: '5G = Cáncer',
    metadata: { "Tipo": "Pseudociencia", "Evidencia": "Ninguna peer-reviewed", "Trust-Score": "Nula" }
  },
  {
    id: 'l4_n3', type: 'noise', icon: '💀',
    text: '[DOCUMENTAL] \"200 Pruebas de que la Tierra es Plana\": Recopilación de argumentos pseudocientíficos que contradicen siglos de física verificada.',
    source: 'FlatEarth.net 2019', level: [4], text_scaffold: 'Tierra = Plana',
    metadata: { "Tipo": "Pseudociencia", "Refutación": "NASA, ESA, 200+ agencias", "Trust-Score": "Nula" }
  },
  {
    id: 'l4_n4', type: 'noise', icon: '💀',
    text: '[HILO] r/conspiracy: \"Big Pharma esconde la cura del cáncer porque los tratamientos generan más dinero. Las curas naturales existen pero son censuradas.\"',
    source: 'Reddit r/conspiracy 2023', level: [4], text_scaffold: 'Big Pharma Miente',
    metadata: { "Tipo": "Teoría Conspirativa", "Evidencia": "Anecdótica", "Trust-Score": "Nula" }
  },

  // Outdated: Historical medical practices
  {
    id: 'l4_o1', type: 'outdated', icon: '⏳',
    text: '[TRATADO] Manual de Medicina 1950: \"Para fiebre persistente, aplicar 4-6 sanguijuelas detrás de las orejas y mantener al paciente en ayuno absoluto por 48 horas.\"',
    source: 'Medical Journal 1950', level: [4], text_scaffold: 'Método: Sanguijuelas',
    metadata: { "Tipo": "Tratado Médico", "Año": "1950", "Estado": "Práctica abandonada", "Trust-Score": "Obsoleta" }
  },

  // Ambiguous: Semi-valid but questionable
  {
    id: 'l4_a1', type: 'ambiguous', icon: '❓',
    text: '[PREPRINT] bioRxiv 2023: Estudio preliminar sobre nuevo biomarcador para detección temprana de Alzheimer. Aún sin revisión por pares ni replicación.',
    source: 'bioRxiv Preprint 2023', level: [4],
    metadata: { "Tipo": "Preprint", "Estado": "Sin peer-review", "Trust-Score": "Media (Prometedor pero no verificado)" }
  },
  {
    id: 'l4_a2', type: 'ambiguous', icon: '❓',
    text: '[META-ANÁLISIS] Cochrane 2022: Revisión sistemática de 34 estudios sobre suplementos de vitamina D. Resultados mixtos, conclusiones aún debatidas.',
    source: 'Cochrane Library 2022', level: [4],
    metadata: { "Tipo": "Meta-análisis", "Estudios": "34", "Resultado": "Inconcluso", "Trust-Score": "Media-Alta" }
  },
];

// ── NIVEL 5: High Stakes ─────────────────────────────────
export const LEVEL_5_INGREDIENTS = [
  // Clean: Gold-standard medical evidence
  {
    id: 'l5_c1', type: 'clean', icon: '🏥',
    text: '[RCT] NEJM 2025: Ensayo clínico aleatorizado de fase III para nuevo antibiótico de amplio espectro. n=8,500. Eficacia: 97.2%. Sin efectos adversos graves.',
    source: 'New England Journal of Medicine 2025', level: [5],
    metadata: { "Tipo": "Ensayo Clínico RCT", "Fase": "III", "n": "8,500", "Trust-Score": "Excelente" }
  },
  {
    id: 'l5_c2', type: 'clean', icon: '🔬',
    text: '[FDA] Aprobación acelerada de tratamiento génico para distrofia muscular de Duchenne. Datos de seguridad completos y seguimiento a 5 años disponibles.',
    source: 'FDA.gov Official 2025', level: [5],
    metadata: { "Tipo": "Aprobación Regulatoria", "Seguimiento": "5 años", "Seguridad": "Completa", "Trust-Score": "Excelente" }
  },
  {
    id: 'l5_c3', type: 'clean', icon: '📊',
    text: '[GUÍA] UpToDate 2025: Protocolo de diagnóstico diferencial para dolor torácico agudo basado en evidencia. Incluye algoritmo de decisión clínica.',
    source: 'UpToDate Clinical 2025', level: [5],
    metadata: { "Tipo": "Guía Basada en Evidencia", "Actualización": "Marzo 2025", "Trust-Score": "Excelente" }
  },
  {
    id: 'l5_c4', type: 'clean', icon: '🩺',
    text: '[PROTOCOLO] AMA 2025: Guías de práctica clínica para manejo de diabetes tipo 2 en adultos. Revisión completa con 142 referencias peer-reviewed.',
    source: 'AMA Clinical Guidelines 2025', level: [5],
    metadata: { "Tipo": "Protocolo Clínico", "Referencias": "142 papers", "Trust-Score": "Excelente" }
  },

  // Noise: Dangerous pseudoscience
  {
    id: 'l5_n1', type: 'noise', icon: '💀',
    text: '[BLOG] NaturalNews: \"La homeopatía cura TODO: cáncer, diabetes, COVID y autismo. Los médicos no quieren que lo sepas. Agua con memoria molecular.\"',
    source: 'NaturalNews 2023', level: [5], text_scaffold: 'Cura: Homeopatía',
    metadata: { "Tipo": "Pseudomedicina", "Evidencia": "Cero estudios RCT", "Peligro": "Crítico", "Trust-Score": "Nula" }
  },
  {
    id: 'l5_n2', type: 'noise', icon: '💀',
    text: '[TELEGRAM] Canal Anti-Pharma: \"La ivermectina cura cualquier virus incluyendo COVID-19. Tomar 3 pastillas de uso veterinario al día. #IvermectinaFunciona\"',
    source: 'Telegram Anti-Pharma Channel', level: [5], text_scaffold: 'Ivermectin = Cura',
    metadata: { "Tipo": "Automedicación Peligrosa", "FDA": "Desaconsejado", "Peligro": "Intoxicación", "Trust-Score": "Nula" }
  },
  {
    id: 'l5_n3', type: 'noise', icon: '💀',
    text: '[SITIO WEB] HealthGuru.xyz: \"Los cristales de cuarzo rosa alinean los chakras y curan la ansiedad, depresión y fibromialgia. Compra tu kit de sanación por $299.\"',
    source: 'HealthGuru.xyz 2022', level: [5], text_scaffold: 'Cristales Sanan',
    metadata: { "Tipo": "Estafa Comercial", "Base Científica": "Ninguna", "Peligro": "Retrasa tratamiento real", "Trust-Score": "Nula" }
  },

  // Outdated: Dangerously obsolete medical practices
  {
    id: 'l5_o1', type: 'outdated', icon: '⏳',
    text: '[ARCHIVO] Manual Clínico 1920: \"Para dolor abdominal severo, administrar tintura de opio (laudanum) vía oral. Dosis: 15 gotas cada 4 horas hasta sedación.\"',
    source: 'Medical Archive 1920', level: [5], text_scaffold: 'Tratamiento: Opio',
    metadata: { "Tipo": "Práctica Abandonada", "Año": "1920", "Estado": "Sustancia controlada ilegal", "Trust-Score": "Obsoleta/Peligrosa" }
  },
  {
    id: 'l5_o2', type: 'outdated', icon: '⏳',
    text: '[MANUAL] Surgery Manual 1850: \"Procedimiento de flebotomía: Extraer 500ml de sangre venosa para reequilibrar los cuatro humores corporales del paciente.\"',
    source: 'Surgery Manual 1850', level: [5], text_scaffold: 'Rx: Flebotomía',
    metadata: { "Tipo": "Cirugía Obsoleta", "Año": "1850", "Estado": "Basada en teoría humoral refutada", "Trust-Score": "Obsoleta/Peligrosa" }
  },

  // Biased: Non-representative clinical data
  {
    id: 'l5_b1', type: 'biased', icon: '⚠️',
    text: '[ESTUDIO] Cardiology Study 1995: Ensayo de eficacia de beta-bloqueadores. Muestra: 500 hombres caucásicos entre 45-65 años. Ninguna mujer incluida.',
    source: 'Cardiology Study 1995', level: [5], text_scaffold: 'Solo Hombres: n=500',
    metadata: { "Tipo": "Estudio Sesgado", "Sesgo": "100% masculino, 100% caucásico", "Año": "1995", "Trust-Score": "Sesgada" }
  },

  // Ambiguous: Valid but insufficient evidence
  {
    id: 'l5_a1', type: 'ambiguous', icon: '❓',
    text: '[REPORTE] Case Reports 2023: Un solo caso documentado de paciente con reacción adversa atípica a nuevo fármaco. Sin grupo de control ni replicación.',
    source: 'Case Reports Journal 2023', level: [5],
    metadata: { "Tipo": "Reporte de Caso", "n": "1", "Limitación": "Sin replicación", "Trust-Score": "Media-Baja" }
  },

  // Poison: Adversarial data attack
  {
    id: 'l5_p1', type: 'poison', icon: '☢️',
    text: '[⚠️ ALERTA] Dataset inyectado con registros clínicos modificados: diagnósticos benignos etiquetados como malignos y viceversa. Hash de integridad INVÁLIDO.',
    source: 'Adversarial Attack — Origen Desconocido', level: [5], text_scaffold: 'DATA POISONED',
    metadata: { "Tipo": "Data Poisoning", "Hash": "MISMATCH", "Integridad": "COMPROMETIDA", "Trust-Score": "ATAQUE" }
  },
];


// ── NIVEL 6: Search & Rescue K9 Training ─────────────────
export const LEVEL_6_INGREDIENTS = [
  // CLEAN (10)
  { id: 'K9_GShep_Rubble_01', type: 'clean', icon: '🐕', text: 'K9 German Shepherd Rubble', source: 'FEMA_Dataset_2025', level: [6], image: './assets/level6/clean/K9_GShep_Rubble_01.jpg', correctAction: 'accept', metadata: { ResNet_Tag: 'german_shepherd', Env: 'collapsed_concrete', Source: 'FEMA_Dataset_2025' } },
  { id: 'K9_GShep_Snow_02', type: 'clean', icon: '🐕', text: 'K9 German Shepherd Snow', source: 'RedCross_Alpine', level: [6], image: './assets/level6/clean/K9_GShep_Snow_02.jpg', correctAction: 'accept', metadata: { ResNet_Tag: 'german_shepherd', Env: 'arctic_search', Source: 'RedCross_Alpine' } },
  { id: 'K9_GShep_Mud_03', type: 'clean', icon: '🐕', text: 'K9 German Shepherd Mud', source: 'INDICI_Peru_Disaster', level: [6], image: './assets/level6/clean/K9_GShep_Mud_03.jpg', correctAction: 'accept', metadata: { ResNet_Tag: 'german_shepherd', Env: 'mud_landslide', Source: 'INDICI_Peru_Disaster' } },
  { id: 'K9_GShep_Night_04', type: 'clean', icon: '🐕', text: 'K9 German Shepherd Night', source: 'IR_Thermal_Drone_v2', level: [6], image: './assets/level6/clean/K9_GShep_Night_04.jpg', correctAction: 'accept', metadata: { ResNet_Tag: 'german_shepherd', Env: 'low_light_debris', Source: 'IR_Thermal_Drone_v2' } },
  { id: 'K9_GShep_Water_05', type: 'clean', icon: '🐕', text: 'K9 German Shepherd Water', source: 'CoastGuard_Training', level: [6], image: './assets/level6/clean/K9_GShep_Water_05.jpg', correctAction: 'accept', metadata: { ResNet_Tag: 'german_shepherd', Env: 'flooded_urban', Source: 'CoastGuard_Training' } },
  { id: 'K9_GShep_Forest_06', type: 'clean', icon: '🐕', text: 'K9 German Shepherd Forest', source: 'State_SAR_Team', level: [6], image: './assets/level6/clean/K9_GShep_Forest_06.jpg', correctAction: 'accept', metadata: { ResNet_Tag: 'german_shepherd', Env: 'dense_forest_search', Source: 'State_SAR_Team' } },
  { id: 'K9_GShep_Rope_07', type: 'clean', icon: '🐕', text: 'K9 Rescue Rope', source: 'Alpine_Rescue_Corps', level: [6], image: './assets/level6/clean/K9_GShep_Rope_07.jpg', correctAction: 'accept', metadata: { ResNet_Tag: 'canine_rescue', Env: 'mountain_crevice', Source: 'Alpine_Rescue_Corps' } },
  { id: 'K9_GShep_Dust_08', type: 'clean', icon: '🐕', text: 'K9 German Shepherd Dust', source: 'UN_OCHA_2025', level: [6], image: './assets/level6/clean/K9_GShep_Dust_08.jpg', correctAction: 'accept', metadata: { ResNet_Tag: 'german_shepherd', Env: 'dusty_earthquake_zone', Source: 'UN_OCHA_2025' } },
  { id: 'K9_GShep_Ruins_09', type: 'clean', icon: '🐕', text: 'K9 German Shepherd Ruins', source: 'FEMA_Dataset_2025', level: [6], image: './assets/level6/clean/K9_GShep_Ruins_09.jpg', correctAction: 'accept', metadata: { ResNet_Tag: 'german_shepherd', Env: 'industrial_ruins', Source: 'FEMA_Dataset_2025' } },
  { id: 'K9_GShep_Rescue_10', type: 'clean', icon: '🐕', text: 'K9 German Shepherd Rescue', source: 'UK_ISAR_Team', level: [6], image: './assets/level6/clean/K9_GShep_Rescue_10.jpg', correctAction: 'accept', metadata: { ResNet_Tag: 'german_shepherd', Env: 'shattered_brickyard', Source: 'UK_ISAR_Team' } },

  // SPURIOUS CORRELATION (8)
  { id: 'Spurious_Park_01', type: 'spurious', icon: '🐕', text: 'Dog Suburban Park', source: 'Instagram_Scraped', level: [6], image: './assets/level6/spurious/Spurious_Park_01.jpg', correctAction: 'reject', metadata: { ResNet_Tag: 'german_shepherd, green_grass, park_bench', Env: 'suburban_park', Source: 'Instagram_Scraped' } },
  { id: 'Spurious_Show_02', type: 'spurious', icon: '🐕', text: 'Dog Clean Interior', source: 'AKC_DogShow_Archive', level: [6], image: './assets/level6/spurious/Spurious_Show_02.jpg', correctAction: 'reject', metadata: { ResNet_Tag: 'german_shepherd, trophy, studio_light', Env: 'clean_interior', Source: 'AKC_DogShow_Archive' } },
  { id: 'Spurious_Harness_03', type: 'spurious', icon: '🐕', text: 'Canine High Vis Vest', source: 'Internal_Logistics', level: [6], image: './assets/level6/spurious/Spurious_Harness_03.jpg', correctAction: 'flag', metadata: { ResNet_Tag: 'canine, high_vis_vest, office', Env: 'hq_barracks', Source: 'Internal_Logistics' } },
  { id: 'Spurious_Beach_04', type: 'spurious', icon: '🐕', text: 'Dog Vacation Resort', source: 'Reddit_Raw', level: [6], image: './assets/level6/spurious/Spurious_Beach_04.jpg', correctAction: 'reject', metadata: { ResNet_Tag: 'german_shepherd, sand, ocean', Env: 'vacation_resort', Source: 'Reddit_Raw' } },
  { id: 'Spurious_Couch_05', type: 'spurious', icon: '🐕', text: 'Dog Couch Indoor', source: 'TikTok_Scraped', level: [6], image: './assets/level6/spurious/Spurious_Couch_05.jpg', correctAction: 'reject', metadata: { ResNet_Tag: 'german_shepherd, living_room, sofa', Env: 'indoor_apartment', Source: 'TikTok_Scraped' } },
  { id: 'Spurious_Leash_06', type: 'spurious', icon: '🐕', text: 'Dog Urban Sidewalk', source: 'Flickr_Commons', level: [6], image: './assets/level6/spurious/Spurious_Leash_06.jpg', correctAction: 'reject', metadata: { ResNet_Tag: 'german_shepherd, leash, pavement', Env: 'urban_sidewalk', Source: 'Flickr_Commons' } },
  { id: 'Spurious_Collar_07', type: 'spurious', icon: '🐕', text: 'Canine Pink Collar', source: 'Pinterest_Scraped', level: [6], image: './assets/level6/spurious/Spurious_Collar_07.jpg', correctAction: 'reject', metadata: { ResNet_Tag: 'canine, pink_collar, garden', Env: 'backyard', Source: 'Pinterest_Scraped' } },
  { id: 'Spurious_Training_08', type: 'spurious', icon: '🐕', text: 'Dog Indoor Training', source: 'PetSmart_Media', level: [6], image: './assets/level6/spurious/Spurious_Training_08.jpg', correctAction: 'flag', metadata: { ResNet_Tag: 'german_shepherd, treat, indoor', Env: 'training_center', Source: 'PetSmart_Media' } },

  // CLASS NOISE (7)
  { id: 'Noise_Chihuahua_01', type: 'noise', icon: '🐕', text: 'Chihuahua Rubble Mockup', source: 'Pet_Owners_Upload', level: [6], image: './assets/level6/noise/Noise_Chihuahua_01.jpg', correctAction: 'reject', metadata: { ResNet_Tag: 'chihuahua', Env: 'rubble_mockup', Source: 'Pet_Owners_Upload' } },
  { id: 'Noise_Husky_02', type: 'noise', icon: '🐕', text: 'Husky Snow Mountain', source: 'Travel_Blog_Data', level: [6], image: './assets/level6/noise/Noise_Husky_02.jpg', correctAction: 'reject', metadata: { ResNet_Tag: 'siberian_husky', Env: 'snow_mountain', Source: 'Travel_Blog_Data' } },
  { id: 'Noise_Coyote_03', type: 'noise', icon: '🐕', text: 'Coyote Desert Ruins', source: 'Wildlife_Cam_West', level: [6], image: './assets/level6/noise/Noise_Coyote_03.jpg', correctAction: 'reject', metadata: { ResNet_Tag: 'wild_coyote', Env: 'desert_ruins', Source: 'Wildlife_Cam_West' } },
  { id: 'Noise_Toy_04', type: 'noise', icon: '🧸', text: 'Plush Stuffed Animal', source: 'Disaster_Scrap_09', level: [6], image: './assets/level6/noise/Noise_Toy_04.jpg', correctAction: 'reject', metadata: { ResNet_Tag: 'stuffed_animal_plush', Env: 'collapsed_kindergarten', Source: 'Disaster_Scrap_09' } },
  { id: 'Noise_Cat_05', type: 'noise', icon: '🐈', text: 'Tabby Cat Attic', source: 'Stray_Cat_Rescue', level: [6], image: './assets/level6/noise/Noise_Cat_05.jpg', correctAction: 'reject', metadata: { ResNet_Tag: 'tabby_cat', Env: 'collapsed_attic', Source: 'Stray_Cat_Rescue' } },
  { id: 'Noise_Fox_06', type: 'noise', icon: '🦊', text: 'Red Fox Forest Debris', source: 'Forestry_Cam_Northeast', level: [6], image: './assets/level6/noise/Noise_Fox_06.jpg', correctAction: 'reject', metadata: { ResNet_Tag: 'red_fox', Env: 'forest_debris', Source: 'Forestry_Cam_Northeast' } },
  { id: 'Noise_Cardboard_07', type: 'noise', icon: '📦', text: 'Cardboard Dog Rubble', source: 'Sensory_Test_Lab', level: [6], image: './assets/level6/noise/Noise_Cardboard_07.jpg', correctAction: 'reject', metadata: { ResNet_Tag: 'cardboard_box_dog_shape', Env: 'rubble_mockup', Source: 'Sensory_Test_Lab' } },

  // ADVERSARIAL POISONING (5)
  { id: 'Poison_AdvPatch_01', type: 'poison', icon: '☢️', text: 'Adversarial Patch Hacker', source: 'Hacker_Anon_Injected', level: [6], image: './assets/level6/poison/Poison_AdvPatch_01.jpg', correctAction: 'flag', metadata: { ResNet_Tag: 'unknown', Hash_Checksum: 'ERR_MISMATCH_SIGMA', Source: 'Hacker_Anon_Injected' } },
  { id: 'Poison_Glitch_02', type: 'poison', icon: '☢️', text: 'Glitch Corrupt Matrix', source: 'Corrupted_Sensor_4', level: [6], image: './assets/level6/poison/Poison_Glitch_02.jpg', correctAction: 'flag', metadata: { ResNet_Tag: 'corrupt_pixel_matrix', Noise: 'Gaussian_Salt_Pepper', Source: 'Corrupted_Sensor_Node_4' } },
  { id: 'Poison_Stale_03', type: 'poison', icon: '☢️', text: 'Stale Historical Drawing', source: 'Stale_Web_Scraping', level: [6], image: './assets/level6/poison/Poison_Stale_03.jpg', correctAction: 'flag', metadata: { ResNet_Tag: 'historical_drawing_canine', Date: '1840_Engraving', Source: 'Stale_Web_Scraping' } },
  { id: 'Poison_Trigger_04', type: 'poison', icon: '☢️', text: 'Backdoor Pixel Trigger', source: 'Hacker_Backdoor_2025', level: [6], image: './assets/level6/poison/Poison_Trigger_04.jpg', correctAction: 'flag', metadata: { ResNet_Tag: 'german_shepherd', Poison_Trigger: 'pixel_1x1_yellow', Source: 'Hacker_Backdoor_2025' } },
  { id: 'Poison_Adversarial_05', type: 'poison', icon: '☢️', text: 'Adversarial Toaster Attack', source: 'Adversarial_Attack_Test', level: [6], image: './assets/level6/poison/Poison_Adversarial_05.jpg', correctAction: 'flag', metadata: { ResNet_Tag: 'toaster_adversarial_perturbation', Similarity: '99.2%_GShep', Source: 'Adversarial_Attack_Test' } },
];

// Función de utilidad para obtener ingredientes de un nivel
export function getIngredientsForLevel(levelNumber) {
  const maps = {
    1: LEVEL_1_INGREDIENTS,
    2: LEVEL_2_INGREDIENTS,
    3: LEVEL_3_INGREDIENTS,
    4: LEVEL_4_INGREDIENTS,
    5: LEVEL_5_INGREDIENTS,
    6: LEVEL_6_INGREDIENTS,
  };
  return maps[levelNumber] || [];
}
