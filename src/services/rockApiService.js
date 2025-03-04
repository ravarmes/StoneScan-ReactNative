// This is a mock service that simulates API calls for rock identification
// In a real application, this would connect to a backend service with AI capabilities

// Mock data for rocks
const rockDatabase = [
  {
    id: '1',
    name: 'Granito Amarelo Capri',
    description: 'Granito de cor amarela com padrão uniforme, ideal para ambientes internos.',
    category: 'Granito',
    characteristics: [
      { name: 'Tipo', value: 'Granito' },
      { name: 'Cor predominante', value: 'Amarelo' },
      { name: 'Densidade Aparente', value: '2606 kg/m³' },
      { name: 'Absorção d\'água', value: '0,51%' },
      { name: 'Porosidade Aparente', value: '1,34%' },
      { name: 'Flexão', value: '8,78 MPa' },
    ],
    applications: [
      'Revestimentos interiores de paredes',
      'Divisórias',
      'Pisos de baixo tráfego',
      'Escadas',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos ou abrasivos. Recomenda-se aplicar impermeabilizante a cada 12 meses.'
  },
  {
    id: '2',
    name: 'Granito Amarelo Florença',
    description: 'Granito amarelo com padrão delicado, perfeito para ambientes sofisticados.',
    category: 'Granito',
    characteristics: [
      { name: 'Tipo', value: 'Granito' },
      { name: 'Cor predominante', value: 'Amarelo' },
      { name: 'Densidade Aparente', value: '2644 kg/m³' },
      { name: 'Absorção d\'água', value: '0,38%' },
      { name: 'Porosidade Aparente', value: '1,00%' },
      { name: 'Flexão', value: '7,42 MPa' },
    ],
    applications: [
      'Revestimentos interiores de paredes',
      'Divisórias',
      'Pisos de baixo tráfego',
      'Escadas',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos ou abrasivos. Recomenda-se aplicar impermeabilizante a cada 12 meses.'
  },
  {
    id: '3',
    name: 'Granito Amarelo Ouro Brasil',
    description: 'Granito dourado com padrão exuberante, adequado para ambientes internos e externos.',
    category: 'Granito',
    characteristics: [
      { name: 'Tipo', value: 'Granito' },
      { name: 'Cor predominante', value: 'Amarelo dourado' },
      { name: 'Densidade Aparente', value: '2670 kg/m³' },
      { name: 'Absorção d\'água', value: '0,32%' },
      { name: 'Porosidade Aparente', value: '0,85%' },
      { name: 'Flexão', value: '9,23 MPa' },
    ],
    applications: [
      'Revestimentos interiores',
      'Revestimentos exteriores',
      'Fachadas aeradas',
      'Pisos de baixo tráfego',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos ou abrasivos. Recomenda-se aplicar impermeabilizante a cada 12 meses.'
  },
  {
    id: '4',
    name: 'Granito Amêndoa Jaciguá',
    description: 'Granito de tonalidade amêndoa, versátil para diversos ambientes internos.',
    category: 'Granito',
    characteristics: [
      { name: 'Tipo', value: 'Granito' },
      { name: 'Cor predominante', value: 'Amêndoa' },
      { name: 'Densidade Aparente', value: '2632 kg/m³' },
      { name: 'Absorção d\'água', value: '0,41%' },
      { name: 'Porosidade Aparente', value: '1,08%' },
      { name: 'Flexão', value: '8,76 MPa' },
    ],
    applications: [
      'Revestimentos interiores de paredes',
      'Divisórias',
      'Pisos de baixo tráfego',
      'Escadas',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos ou abrasivos. Recomenda-se aplicar impermeabilizante a cada 12 meses.'
  },
  {
    id: '5',
    name: 'Granito Bege Butterfly',
    description: 'Granito bege com padrão delicado, adequado para ambientes internos e externos.',
    category: 'Granito',
    characteristics: [
      { name: 'Tipo', value: 'Granito' },
      { name: 'Cor predominante', value: 'Bege' },
      { name: 'Densidade Aparente', value: '2632 kg/m³' },
      { name: 'Absorção d\'água', value: '0,35%' },
      { name: 'Porosidade Aparente', value: '0,92%' },
      { name: 'Flexão', value: '11,43 MPa' },
    ],
    applications: [
      'Revestimentos interiores',
      'Revestimentos exteriores',
      'Fachadas aeradas',
      'Pisos de baixo tráfego',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos ou abrasivos. Recomenda-se aplicar impermeabilizante a cada 12 meses.'
  },
  {
    id: '6',
    name: 'Granito Gold 500',
    description: 'Granito dourado com padrão único, versátil para ambientes internos e externos.',
    category: 'Granito',
    characteristics: [
      { name: 'Tipo', value: 'Granito' },
      { name: 'Cor predominante', value: 'Dourado' },
      { name: 'Densidade Aparente', value: '2641 kg/m³' },
      { name: 'Absorção d\'água', value: '0,36%' },
      { name: 'Porosidade Aparente', value: '0,94%' },
      { name: 'Flexão', value: '8,92 MPa' },
    ],
    applications: [
      'Revestimentos interiores',
      'Revestimentos exteriores',
      'Fachadas',
      'Pisos de baixo tráfego',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos ou abrasivos. Recomenda-se aplicar impermeabilizante a cada 12 meses.'
  },
  {
    id: '7',
    name: 'Granito Preto São Gabriel',
    description: 'Granito preto com alta resistência, ideal para diversos ambientes.',
    category: 'Granito',
    characteristics: [
      { name: 'Tipo', value: 'Granito' },
      { name: 'Cor predominante', value: 'Preto' },
      { name: 'Densidade Aparente', value: '2660 kg/m³' },
      { name: 'Absorção d\'água', value: '0,33%' },
      { name: 'Porosidade Aparente', value: '0,96%' },
      { name: 'Flexão', value: '14,10 MPa' },
    ],
    applications: [
      'Revestimentos interiores',
      'Revestimentos exteriores',
      'Fachadas',
      'Pisos de baixo tráfego',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos ou abrasivos. Recomenda-se aplicar impermeabilizante a cada 12 meses.'
  },
  {
    id: '8',
    name: 'Mármore Branco Clássico',
    description: 'Mármore branco clássico, perfeito para ambientes internos elegantes.',
    category: 'Mármore',
    characteristics: [
      { name: 'Tipo', value: 'Mármore' },
      { name: 'Cor predominante', value: 'Branco' },
      { name: 'Densidade Aparente', value: '2850 kg/m³' },
      { name: 'Absorção d\'água', value: '0,09%' },
      { name: 'Porosidade Aparente', value: '0,26%' },
      { name: 'Flexão', value: '17,59 MPa' },
    ],
    applications: [
      'Pisos de muito baixo tráfego',
      'Paredes internas',
      'Divisórias',
      'Lavabos',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos e materiais abrasivos. Não recomendado para áreas externas ou box de banheiro.'
  },
  {
    id: '9',
    name: 'Mármore Cachoeiro White',
    description: 'Mármore branco de Cachoeiro, elegante e versátil para ambientes internos.',
    category: 'Mármore',
    characteristics: [
      { name: 'Tipo', value: 'Mármore' },
      { name: 'Cor predominante', value: 'Branco' },
      { name: 'Densidade Aparente', value: '2901 kg/m³' },
      { name: 'Absorção d\'água', value: '0,01%' },
      { name: 'Porosidade Aparente', value: '0,04%' },
      { name: 'Flexão', value: '18,11 MPa' },
    ],
    applications: [
      'Pisos de muito baixo tráfego',
      'Paredes internas',
      'Divisórias',
      'Lavabos',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos e materiais abrasivos. Não recomendado para áreas externas ou box de banheiro.'
  },
  {
    id: '10',
    name: 'Mármore Chocolate',
    description: 'Mármore de tonalidade chocolate, sofisticado para ambientes internos.',
    category: 'Mármore',
    characteristics: [
      { name: 'Tipo', value: 'Mármore' },
      { name: 'Cor predominante', value: 'Marrom chocolate' },
      { name: 'Densidade Aparente', value: '2733 kg/m³' },
      { name: 'Absorção d\'água', value: '0,01%' },
      { name: 'Porosidade Aparente', value: '0,02%' },
      { name: 'Flexão', value: '17,54 MPa' },
    ],
    applications: [
      'Pisos de muito baixo tráfego',
      'Paredes internas',
      'Divisórias',
      'Lavabos',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos e materiais abrasivos. Não recomendado para áreas externas ou box de banheiro.'
  },
  {
    id: '11',
    name: 'Mármore Imperial Pink',
    description: 'Mármore rosa imperial, exclusivo para ambientes internos sofisticados.',
    category: 'Mármore',
    characteristics: [
      { name: 'Tipo', value: 'Mármore' },
      { name: 'Cor predominante', value: 'Rosa' },
      { name: 'Densidade Aparente', value: '2732 kg/m³' },
      { name: 'Absorção d\'água', value: '0,06%' },
      { name: 'Porosidade Aparente', value: '0,17%' },
      { name: 'Flexão', value: '18,43 MPa' },
    ],
    applications: [
      'Pisos de muito baixo tráfego',
      'Paredes internas',
      'Divisórias',
      'Lavabos',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos e materiais abrasivos. Não recomendado para áreas externas ou box de banheiro.'
  },
  {
    id: '12',
    name: 'Mármore Pinta Verde',
    description: 'Mármore com detalhes em verde, elegante para ambientes internos.',
    category: 'Mármore',
    characteristics: [
      { name: 'Tipo', value: 'Mármore' },
      { name: 'Cor predominante', value: 'Branco com detalhes verdes' },
      { name: 'Densidade Aparente', value: '2855 kg/m³' },
      { name: 'Absorção d\'água', value: '0,06%' },
      { name: 'Porosidade Aparente', value: '0,17%' },
      { name: 'Flexão', value: '13,04 MPa' },
    ],
    applications: [
      'Pisos de muito baixo tráfego',
      'Paredes internas',
      'Divisórias',
      'Lavabos',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos e materiais abrasivos. Não recomendado para áreas externas ou box de banheiro.'
  }
];

// Simulated delay to mimic API call latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// API service object
const rockApiService = {
  // Get all rocks
  getAllRocks: async () => {
    await delay(800); // Simulate network delay
    return rockDatabase;
  },
  
  // Get rock by ID
  getRockById: async (id) => {
    await delay(500);
    return rockDatabase.find(rock => rock.id === id) || null;
  },
  
  // Search rocks by name
  searchRocks: async (query) => {
    await delay(600);
    const lowercaseQuery = query.toLowerCase();
    return rockDatabase.filter(rock => 
      rock.name.toLowerCase().includes(lowercaseQuery) || 
      rock.description.toLowerCase().includes(lowercaseQuery) ||
      rock.category.toLowerCase().includes(lowercaseQuery)
    );
  },
  
  // Identify rock from image
  identifyRock: async (imageUri) => {
    await delay(2000); // Simulate AI processing time
    
    // In a real app, this would send the image to a backend API
    // and receive the identification results
    
    // For this mock, we'll just return a random rock from our database
    const randomIndex = Math.floor(Math.random() * rockDatabase.length);
    return {
      success: true,
      rock: rockDatabase[randomIndex],
      confidence: 0.92, // Simulated confidence score
    };
  },
  
  // Save scan to history
  saveScanToHistory: async (rockId, imageUri) => {
    await delay(300);
    // In a real app, this would save to a database or local storage
    return {
      success: true,
      scanId: `scan_${Date.now()}`,
    };
  },
  
  // Get scan history
  getScanHistory: async () => {
    await delay(500);
    // In a real app, this would retrieve from a database or local storage
    return [
      {
        id: 'scan_1',
        rockId: '1',
        date: '2023-03-01',
        imageUri: null,
      },
      {
        id: 'scan_2',
        rockId: '2',
        date: '2023-02-28',
        imageUri: null,
      },
    ];
  },
};

export default rockApiService;
