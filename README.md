# 📊 Dashboard Analytics

> Dashboard profissional de e-commerce com visualizações interativas e métricas em tempo real

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61dafb?style=for-the-badge&logo=react)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4.0-ff6384?style=for-the-badge&logo=chart.js)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646cff?style=for-the-badge&logo=vite)
![CSS Modules](https://img.shields.io/badge/CSS%20Modules-Enabled-1572b6?style=for-the-badge&logo=css3)

[🚀 **Ver Demo**](#) • [📱 **Mobile Demo**](#) • [📖 **Documentação**](#-funcionalidades)

</div>

---

## 🎯 **Sobre o Projeto**

Dashboard analytics completo simulando dados reais de uma plataforma de e-commerce. Desenvolvido com foco em **performance**, **responsividade** e **experiência do usuário**, demonstrando habilidades avançadas em visualização de dados e arquitetura frontend moderna.

### **✨ Destaques Técnicos**
- ⚡ **Performance**: Bundle otimizado 457KB (147KB gzipped)
- 📱 **100% Responsivo**: Desktop → Tablet → Mobile
- 🎨 **Design System**: Paleta consistente + CSS Variables
- 📊 **8+ Visualizações**: Charts interativos e personalizados
- 🔄 **Cache Inteligente**: Sistema próprio com TTL
- 🌙 **Dark/Light Mode**: Theme switching completo
- 🖥️ **Modo Apresentação**: Fullscreen para apresentações

---

## 🚀 **Funcionalidades**

### **📊 Dashboard Principal**
- KPIs animados com indicadores de crescimento
- Comparação automática com períodos anteriores
- Atualização em tempo real com loading states
- Filtros de data personalizáveis

### **📈 Visualizações Avançadas**
- **Gráficos de Linha**: Receita e tendências temporais
- **Gráficos de Pizza**: Distribuição por categorias
- **Gráficos de Barras**: Comparações e rankings
- **Heatmap**: Atividade por hora/dia (implementação própria)
- **Funnel de Conversão**: Jornada do usuário
- **Scatter Plot**: Análise de correlação
- **Cohort Analysis**: Retenção de usuários
- **Mapa Geográfico**: Vendas por região

### **📋 Gestão de Dados**
- Tabelas com busca, filtros e paginação
- Ordenação por múltiplas colunas
- Export de dados (CSV/PDF simulado)
- Estados de loading e error handling

### **🎨 Interface e UX**
- Sidebar colapsável e responsiva
- Componentes reutilizáveis e modulares
- Micro-animações e transições suaves
- Acessibilidade (ARIA labels, keyboard navigation)

---

## 🛠️ **Stack Tecnológica**

<table>
<tr>
<td><strong>Frontend Core</strong></td>
<td><strong>Visualização</strong></td>
<td><strong>Tooling</strong></td>
</tr>
<tr>
<td>

- React 18.2
- React Router DOM 6.20
- CSS Modules
- Context API

</td>
<td>

- Chart.js 4.4
- React-ChartJS-2 5.2
- Lucide React (ícones)
- Custom Heatmap

</td>
<td>

- Vite 5.0
- ESLint
- CSS Variables
- Bundle Analyzer

</td>
</tr>
</table>

---

## 📱 **Screenshots**

<details>
<summary><strong>🖥️ Desktop Dashboard</strong></summary>

*Dashboard principal com KPIs e gráficos - Captura de tela em breve*

</details>

<details>
<summary><strong>📱 Mobile Responsive</strong></summary>

*Layout adaptativo para dispositivos móveis - Captura de tela em breve*

</details>

<details>
<summary><strong>🌙 Dark Mode</strong></summary>

*Tema escuro com transições suaves - Captura de tela em breve*

</details>

---

## 🚀 **Quick Start**

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn

### **Instalação**
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/dashboard-analytics.git

# Entre no diretório
cd dashboard-analytics

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Acesse http://localhost:5173
```

### **Build para Produção**
```bash
# Gera build otimizada
npm run build

# Preview da build
npm run preview
```

---

## 🏗️ **Arquitetura do Projeto**

```
src/
├── components/           # Componentes reutilizáveis
│   ├── charts/          # Gráficos específicos
│   ├── dashboard/       # Componentes do dashboard
│   ├── layout/          # Layout base (Header, Sidebar)
│   ├── table/           # Tabelas de dados
│   └── ui/              # Componentes base (Button, Card, etc)
├── contexts/            # Context API (Theme, DateRange)
├── data/                # Serviços de dados e mock
├── hooks/               # Custom hooks
├── pages/               # Páginas principais
├── styles/              # Estilos globais e variables
└── utils/               # Utilitários e helpers
```

### **Padrões de Código**
- ✅ **CSS Modules**: Isolamento de estilos
- ✅ **Custom Hooks**: Lógica reutilizável
- ✅ **Context Pattern**: Estado global limpo
- ✅ **Error Boundaries**: Tratamento robusto de erros
- ✅ **Lazy Loading**: Otimização de performance

---

## 📊 **Sistema de Dados**

O projeto utiliza um **gerador de dados sofisticado** que simula dados reais de e-commerce:

### **Métricas Simuladas**
- 💰 **Receita**: R$ 2.8M+ com crescimento mensal
- 🛒 **Pedidos**: 18K+ com sazonalidade
- 👥 **Usuários**: 45K+ usuários ativos
- 📈 **Conversão**: 3.2% taxa média
- 🎯 **Ticket Médio**: R$ 154,50

### **Características Técnicas**
- **Cache System**: TTL de 5min para otimização
- **API Simulation**: Delays realistas (200-800ms)
- **Data Consistency**: Dados relacionados e coerentes
- **Historical Data**: 12 meses de histórico

---

## ⚡ **Performance**

### **Bundle Analysis**
- 📦 **Total**: 457.43 KB (147.88 KB gzipped)
- 🎨 **CSS**: 72.12 KB (11.55 KB gzipped)
- ⚡ **Build Time**: ~10s
- 🚀 **First Load**: < 2s

### **Otimizações Implementadas**
- Code splitting por rotas
- Componentes memoizados com React.memo
- Lazy loading de gráficos pesados
- Cache de requisições com TTL
- CSS variables para theming eficiente

---

## 🎨 **Design System**

### **Paleta de Cores**
```css
:root {
  --primary-500: #3b82f6;      /* Azul principal */
  --success-500: #22c55e;      /* Verde crescimento */
  --warning-500: #eab308;      /* Amarelo neutro */
  --danger-500: #ef4444;       /* Vermelho declínio */
}
```

### **Typography**
- **Headings**: Inter (500-600 weight)
- **Body**: Inter (400 weight)
- **Numbers**: JetBrains Mono

### **Spacing System**
- Base: 8px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px

---

## 🔮 **Roadmap**

### **v2.0 - Próximas Features**
- [ ] Export PDF/Excel real
- [ ] Testes automatizados (Jest + Testing Library)
- [ ] TypeScript migration
- [ ] PWA features
- [ ] Real-time WebSocket simulation

### **v2.1 - Melhorias**
- [ ] Dashboards customizáveis
- [ ] Alertas e notificações
- [ ] Internacionalização (i18n)
- [ ] Storybook documentation

---

## 🤝 **Contribuição**

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Add: nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

---

## 📄 **Licença**

Este projeto está sob a licença MIT.

---

## 👨‍💻 **Sobre**

Projeto desenvolvido para demonstrar habilidades em desenvolvimento frontend com React, visualização de dados e arquitetura de aplicações modernas.

**Principais competências demonstradas:**
- Arquitetura de componentes React
- Gerenciamento de estado com Context API
- Integração com bibliotecas de gráficos
- Responsividade e UX/UI
- Performance optimization
- Código limpo e manutenível

---

<div align="center">

**⭐ Se este projeto te ajudou, deixe uma estrela!**

---

*Desenvolvido com ❤️ e React*

</div>