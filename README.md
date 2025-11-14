# Recipe Calculator

Web application for calculating and managing recipes developed with React, Vite, and Bootstrap.

## 🚀 Prerequisites

Before you begin, make sure you have installed:

- **Node.js** (version 16 or higher)
- **npm** (comes bundled with Node.js)

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd recipe-calculator
npm install
```

## 🛠️ Main Commands

### Development

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (by default).

### Production Build

Generate optimized files for production:

```bash
npm run build
```

Files will be generated in the `dist/` folder.

### Production Preview

Preview the production build locally before deployment:

```bash
npm run preview
```

### Linting

Run the linter to check and maintain code quality:

```bash
npm run lint
```

### GitHub Pages Deployment

Deploy the application to GitHub Pages automatically:

```bash
npm run deploy
```

This command runs `predeploy` (build) and then publishes to GitHub Pages.

## 🌐 Production URL

The application is deployed at:
```
https://mariopw.github.io/Recipe-Calculator
```

## 📚 Main Technologies

- **React 18.3.1** - Main UI library
- **Vite 6.0.3** - Build tool and development server
- **Bootstrap 5.3.3** - CSS framework
- **React Router DOM 7.1.1** - Routing
- **i18next** - Internationalization
- **jsPDF** - PDF generation
- **XLSX** - Excel file handling
- **Zod** - Schema validation

## 📝 Scripts Structure

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build application for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint to check code |
| `npm run predeploy` | Runs automatically before deploy |
| `npm run deploy` | Deploy to GitHub Pages |

## 🔧 Additional Configuration

### Environment Variables

If your project requires environment variables, create a `.env` file in the project root:

```env
VITE_API_URL=your_url_here
```

### Vite Configuration

Vite configuration is located in `vite.config.js` at the project root.

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add: new feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and has no public license.

## 👨‍💻 Development

To start developing:

1. Run `npm run dev`
2. Open your browser at `http://localhost:5173`
3. Changes will be reflected automatically

## 🐛 Troubleshooting

### Development server won't start

```bash
# Clean node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors

```bash
# Clean Vite cache
rm -rf node_modules/.vite
npm run build
```

---

Developed with ❤️ using React and Vite