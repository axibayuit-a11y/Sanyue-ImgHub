# Sanyue ImgHub

Frontend application for CloudFlare ImgBed - a free, open-source file hosting solution.

## Tech Stack

- Vue 3 + Vue Router
- Element Plus UI
- vue-i18n (23 languages)
- Axios

## Features

- File upload with drag & drop
- Admin dashboard for file management
- System configuration panel
- Public gallery browsing
- Dark/Light theme toggle
- Multi-language support with auto-detection
- Responsive design (mobile-friendly)

## Supported Languages

Chinese (Simplified/Traditional), English, Japanese, Korean, Spanish, Portuguese, French, German, Italian, Dutch, Polish, Czech, Ukrainian, Russian, Turkish, Arabic, Hindi, Bengali, Thai, Vietnamese, Malay, Indonesian

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run serve

# Build for production
npm run build
```

### Environment Variables

Edit `.env.development` to configure:

```
VUE_APP_BACKEND_URL=http://localhost:8788
```

## Deployment

1. Clone the backend repo [CloudFlare-ImgBed](https://github.com/axibayuit-a11y/CloudFlare-ImgBed)
2. Build this frontend: `npm run build`
3. Copy contents of `/dist` to the backend's root directory
4. Deploy the backend to Cloudflare Pages

## License

MIT License
