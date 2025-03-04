<h1 align="center">
    <img alt="Fapes" src="assets/logo-fapes.png" width="300" />
    <img alt="Granimaster" src="assets/logo-granimaster.png" width="300" />
</h1>

<h3 align="center">
  StoneScan: Identificação Inteligente de Rochas Ornamentais
</h3>

<p align="center">Aplicativo de reconhecimento de rochas ornamentais utilizando inteligência artificial e visão computacional.</p>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/ravarmes/StoneScan-ReactNative?color=%2304D361">

  <a href="http://www.linkedin.com/in/rafael-vargas-mesquita">
    <img alt="Made by Rafael Vargas Mesquita" src="https://img.shields.io/badge/made%20by-Rafael%20Vargas%20Mesquita-%2304D361">
  </a>

  <img alt="License" src="https://img.shields.io/badge/license-MIT-%2304D361">

  <a href="https://github.com/ravarmes/StoneScan-ReactNative/stargazers">
    <img alt="Stargazers" src="https://img.shields.io/github/stars/ravarmes/StoneScan-ReactNative?style=social">
  </a>
</p>

## :page_with_curl: Sobre o Projeto <a name="-about"/></a>

O StoneScan é um aplicativo móvel inovador que utiliza inteligência artificial para identificar rochas ornamentais através de fotografias tiradas por smartphones. Desenvolvido para atender tanto profissionais do setor quanto consumidores finais, o aplicativo emprega redes neurais avançadas para reconhecer e classificar diferentes tipos de rochas, como granitos e mármores, a partir de imagens de superfícies como pias, pisos e paredes.

O projeto é resultado de uma colaboração multidisciplinar entre estudantes de Sistemas de Informação e Técnico em Mineração, sob orientação docente. As informações sobre as rochas são baseadas em fontes autorizadas, incluindo o manual de rochas ornamentais do SindRochas e dados fornecidos por empresas parceiras do setor.

### :notebook_with_decorative_cover: Arquitetura do Sistema <a name="-architecture"/></a>

<img src="assets/architecture.png" width="700">

### Funcionalidades

- 📸 Identificação de rochas através de fotos
- 📚 Catálogo detalhado de rochas ornamentais
- ⭐ Sistema de avaliação pessoal
- 📱 Interface intuitiva e moderna
- 📋 Informações técnicas detalhadas
- 🔍 Histórico de identificações
- 📤 Compartilhamento de resultados

### Características das Rochas

Para cada rocha, o aplicativo fornece:
- Descrição detalhada
- Características físico-mecânicas
- Aplicações recomendadas
- Instruções de manutenção
- Sistema de avaliação pessoal

### Requisitos Técnicos

- Node.js 14.x ou superior
- Expo CLI
- React Native
- Expo Go App (para desenvolvimento)

### Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/ravarmes/StoneScan-ReactNative.git
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o projeto:
```bash
npx expo start
```

4. Use o Expo Go em seu dispositivo móvel para escanear o QR Code

### Estrutura do Projeto

```
StoneScanApp/
├── src/
│   ├── assets/         # Imagens e recursos
│   ├── components/     # Componentes React
│   ├── navigation/     # Configuração de navegação
│   ├── screens/        # Telas do aplicativo
│   └── services/       # Serviços e contextos
├── App.js             # Ponto de entrada
└── package.json       # Dependências
```

### Tecnologias Utilizadas

- React Native
- Expo
- React Navigation
- AsyncStorage
- React Native Safe Area Context
- Expo Vector Icons

## Desenvolvimento

O aplicativo está em desenvolvimento ativo. Novas funcionalidades e melhorias são adicionadas regularmente.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
