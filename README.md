# CODE-ATLAS

CODE-ATLAS is an interactive, AI-powered learning and curation platform designed to help users explore, create, and manage educational pathways, resources, and immersive experiences. The project leverages modern web technologies and AI to provide a dynamic and engaging interface for learners, educators, and content creators.

## Features

- **AI Pathway Generation:** Automatically generate personalized learning pathways using AI
- **Resource Curation:** Search, curate, and manage educational resources efficiently
- **Interactive Maps:** Visualize learning journeys and resources on 2D/3D maps with treasure map interfaces
- **Immersive Interfaces:** Engage with content through game-like and immersive UI components
- **User Authentication:** Google Sign-In integration for secure access
- **Customizable Themes:** Switch between different UI themes for a personalized experience
- **Exercise Generation:** AI-powered exercise and content generation
- **Content Slicing:** Break down complex content into manageable learning chunks
- **Web Scraping:** Automated resource discovery and content extraction

## Project Structure

```
├── app/                    # Next.js application pages and layouts
│   ├── api/               # API routes for AI services
│   ├── dashboard/         # Dashboard interface
│   └── pathway/           # Pathway management pages
├── components/            # Reusable UI components
│   ├── ui/               # UI primitives (buttons, cards, etc.)
│   └── theme-provider.tsx # Theme management
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and helpers
├── public/                # Static assets and images
└── styles/                # Global styles
```

### Key Components

- **Interactive Maps:** Multiple map interfaces including treasure maps, 3D space maps, and immersive map experiences
- **Learning Companion:** AI-powered learning assistance
- **Resource Viewer:** Comprehensive resource management and viewing
- **Exercise Interface:** Interactive exercise creation and completion
- **Curation Status:** Track and manage content curation progress

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (recommended) or npm/yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bushra1618/CODE-ATLAS-.git
   cd CODE-ATLAS-
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Set up environment variables (create `.env.local`):
   ```bash
   # Copy from .env.example and fill in your actual values
   cp .env.example .env.local
   
   # Required API keys:
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
   GROK_API_KEY=your_grok_api_key_here
   
   # Add other environment variables as needed
   ```

4. Run the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Dashboard
Access the main dashboard to view and manage your learning pathways, track progress, and explore available resources.

### AI-Powered Features
- **Pathway Generation:** Use AI to create customized learning paths
- **Exercise Creation:** Generate interactive exercises and assessments
- **Content Curation:** Automatically discover and organize relevant resources
- **Intelligent Q&A:** Powered by Grok AI to answer questions about learning content

### Interactive Learning
- **Map Interfaces:** Navigate through learning content using various map visualizations
- **Immersive Experience:** Engage with content through game-like interfaces
- **Progress Tracking:** Monitor learning progress and achievements

## API Endpoints

- `/api/ai-pathway-generator` - Generate AI-powered learning pathways using Grok
- `/api/content-slicer` - Break down content into learning chunks
- `/api/generate-exercise` - Create interactive exercises using Grok AI
- `/api/generate-pathway` - Generate structured learning paths with Grok
- `/api/search-resources` - Search and discover learning resources
- `/api/web-scraper` - Extract content from web resources
- `/api/ai-qa` - Ask questions and get answers from Grok AI

## Technologies Used

- **Frontend:**
  - Next.js (App Router)
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui components

- **Backend:**
  - Next.js API routes
  - AI/ML APIs for content generation
  - Grok AI for intelligent question answering

- **Authentication:**
  - Google Sign-In integration

- **Styling:**
  - Tailwind CSS
  - Custom theme system
  - Responsive design

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by modern educational technology and AI-driven learning platforms
- Built with the latest web technologies and best practices
- Thanks to the open-source community for the amazing tools and libraries
