# LinkedIn Search App

AI-powered LinkedIn profile search application using Exa API. This is an MVP version of [filiksyos/anysearch](https://github.com/filiksyos/anysearch) focused specifically on LinkedIn profile discovery.

## Features

✨ **LinkedIn Profile Search**
- Natural language queries to find LinkedIn profiles
- AI-powered search using Exa API
- Real-time streaming responses
- Clean, modern UI with dark/light mode support
- Built with Next.js 15 and React 19

## How to Use

### Search LinkedIn Profiles

Ask questions like:
- "Find AI engineers"
- "Anthropic developers"
- "Machine learning researchers at Google"
- "Product managers in San Francisco"
- "Software engineers with React experience"

The AI will search LinkedIn and present relevant profiles with:
- Profile summaries
- Direct LinkedIn links
- Key highlights from their profiles

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **AI**: AI SDK, OpenRouter API
- **Search**: Exa API for LinkedIn profile discovery
- **UI**: Radix UI, Tailwind CSS, Lucide Icons

## Setup Instructions

1. **Clone and Install Dependencies**
   ```bash
   git clone https://github.com/filiksyos/linkedin-search-app.git
   cd linkedin-search-app
   pnpm install
   ```

2. **Environment Configuration**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   ```

3. **Add Your API Keys to .env.local**
   ```env
   # Get your OpenRouter API key from: https://openrouter.ai/keys
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   
   # Get your Exa API key from: https://exa.ai
   EXA_API_KEY=your_exa_api_key_here
   
   # Optional: Choose your AI model (default: google/gemini-2.5-pro)
   AI_MODEL=google/gemini-2.5-pro
   ```

4. **Start Development Server**
   ```bash
   pnpm dev
   ```

5. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── ai/
│   └── openrouter.ts        # AI provider configuration
├── app/
│   ├── api/chat/
│   │   └── route.ts         # Chat API endpoint with Exa search
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   ├── ai-elements/         # Conversation UI components
│   ├── chat/                # Chat interface components
│   └── linkedin/            # LinkedIn result components
└── lib/
    ├── chat-context.tsx     # Chat state management
    └── utils.ts             # Utility functions
```

## API Configuration

This app uses:
- **OpenRouter**: For AI model access (GPT, Claude, Gemini, etc.)
- **Exa API**: For LinkedIn profile search with the following configuration:
  - `category: "linkedin profile"`
  - `includeDomains: ["linkedin.com"]`
  - `text: true` (to get profile content)
  - `type: "auto"` (automatic search optimization)

## Development

```bash
# Install dependencies
pnpm install

# Run development server with turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Credits

Based on [filiksyos/anysearch](https://github.com/filiksyos/anysearch) - An AI-powered search application.

## License

MIT
