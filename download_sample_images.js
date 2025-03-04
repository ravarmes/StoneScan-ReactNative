const fs = require('fs');
const https = require('https');
const path = require('path');

// Certifique-se de que o diretório existe
const imageDir = path.join(__dirname, 'src', 'assets', 'images');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Lista de URLs de imagens de placeholder de rochas
// Usando o serviço Lorem Picsum para imagens aleatórias
const rockImages = [
  {
    name: 'granito-preto-sao-gabriel.jpg',
    url: 'https://picsum.photos/seed/granite1/500/300'
  },
  {
    name: 'marmore-branco-espirito-santo.jpg',
    url: 'https://picsum.photos/seed/marble1/500/300'
  },
  {
    name: 'quartzito-azul-macaubas.jpg',
    url: 'https://picsum.photos/seed/quartz1/500/300'
  },
  {
    name: 'granito-verde-ubatuba.jpg',
    url: 'https://picsum.photos/seed/granite2/500/300'
  },
  {
    name: 'marmore-carrara.jpg',
    url: 'https://picsum.photos/seed/marble2/500/300'
  }
];

// Função para baixar uma imagem
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imageDir, filename);
    
    // Cria o stream de escrita
    const file = fs.createWriteStream(filePath);
    
    // Faz a requisição para baixar a imagem
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Imagem ${filename} baixada com sucesso.`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Remove o arquivo se houver erro
      console.error(`Erro ao baixar ${filename}:`, err.message);
      reject(err);
    });
  });
}

// Baixa todas as imagens
async function downloadAllImages() {
  console.log('Iniciando download das imagens...');
  
  try {
    for (const rock of rockImages) {
      await downloadImage(rock.url, rock.name);
    }
    console.log('Todas as imagens foram baixadas com sucesso!');
  } catch (error) {
    console.error('Erro ao baixar as imagens:', error);
  }
}

// Executa a função principal
downloadAllImages(); 