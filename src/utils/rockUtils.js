// Utility functions for working with rock data

/**
 * Formats a date string in the format YYYY-MM-DD to a more readable format
 * @param {string} dateString - Date string in format YYYY-MM-DD
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Groups rocks by category
 * @param {Array} rocks - Array of rock objects
 * @returns {Object} Object with categories as keys and arrays of rocks as values
 */
export const groupRocksByCategory = (rocks) => {
  if (!rocks || !Array.isArray(rocks)) return {};
  
  return rocks.reduce((groups, rock) => {
    const category = rock.category || 'Outros';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(rock);
    return groups;
  }, {});
};

/**
 * Filters rocks by search query
 * @param {Array} rocks - Array of rock objects
 * @param {string} query - Search query
 * @returns {Array} Filtered array of rocks
 */
export const filterRocksByQuery = (rocks, query) => {
  if (!rocks || !Array.isArray(rocks)) return [];
  if (!query) return rocks;
  
  const lowercaseQuery = query.toLowerCase();
  
  return rocks.filter(rock => 
    rock.name.toLowerCase().includes(lowercaseQuery) || 
    rock.description.toLowerCase().includes(lowercaseQuery) ||
    rock.category.toLowerCase().includes(lowercaseQuery)
  );
};

/**
 * Gets a color for a rock category
 * @param {string} category - Rock category
 * @returns {string} Hex color code
 */
export const getCategoryColor = (category) => {
  const colors = {
    'Granito': '#2E7D32', // Green
    'Mármore': '#1976D2', // Blue
    'Quartzito': '#7B1FA2', // Purple
    'Ardósia': '#455A64', // Blue Grey
    'Pedra-sabão': '#795548', // Brown
    'Basalto': '#212121', // Dark Grey
    'Outros': '#757575', // Grey
  };
  
  return colors[category] || colors['Outros'];
};

/**
 * Gets a description of the durability of a rock based on its hardness
 * @param {string} hardness - Rock hardness on the Mohs scale
 * @returns {string} Durability description
 */
export const getDurabilityDescription = (hardness) => {
  if (!hardness) return 'Desconhecida';
  
  // Extract the first number from the hardness string
  const hardnessValue = parseFloat(hardness);
  if (isNaN(hardnessValue)) return 'Desconhecida';
  
  if (hardnessValue < 3) return 'Baixa';
  if (hardnessValue < 5) return 'Média';
  if (hardnessValue < 7) return 'Alta';
  return 'Muito alta';
};

/**
 * Gets recommended applications for a rock based on its characteristics
 * @param {Object} rock - Rock object
 * @returns {Array} Array of recommended applications
 */
export const getRecommendedApplications = (rock) => {
  if (!rock) return [];
  
  const applications = [];
  const hardnessValue = parseFloat(rock.characteristics?.find(c => c.name === 'Dureza')?.value);
  const porosity = rock.characteristics?.find(c => c.name === 'Porosidade')?.value;
  
  // High hardness rocks are good for high traffic areas
  if (!isNaN(hardnessValue) && hardnessValue >= 6) {
    applications.push('Pisos de alto tráfego');
    applications.push('Bancadas de cozinha');
  }
  
  // Low porosity rocks are good for wet areas
  if (porosity === 'Baixa' || porosity === 'Muito baixa') {
    applications.push('Áreas úmidas');
    applications.push('Áreas externas');
  }
  
  // Marble is good for decorative applications
  if (rock.category === 'Mármore') {
    applications.push('Esculturas e objetos decorativos');
    applications.push('Revestimentos de paredes internas');
  }
  
  return applications.length > 0 ? applications : rock.applications || [];
};

export default {
  formatDate,
  groupRocksByCategory,
  filterRocksByQuery,
  getCategoryColor,
  getDurabilityDescription,
  getRecommendedApplications,
};
