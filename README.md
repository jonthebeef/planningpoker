# Planning Poker

A simple, beautiful planning poker web application for Agile teams. Built with Next.js and Firebase for real-time collaboration.

## Features

- 🃏 **Classic Poker Cards** - Standard planning poker values (0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?, ☕)
- 🚀 **Real-time Voting** - Instant synchronization across all participants
- ⏱️ **Auto-reveal** - Automatic countdown when everyone has voted
- 📱 **Mobile-friendly** - Responsive design that works on all devices
- 🎨 **Clean UI** - Beautiful, modern interface with smooth animations
- 💯 **Zero-cost** - Runs entirely on free tiers (Firebase + Netlify)

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd planningpoker
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Realtime Database**
4. Set database rules to public (for simplicity):
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
5. Get your Firebase config from Project Settings > General > Web apps

### 3. Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Firebase configuration:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Enter your name** when you first visit the app
2. **Add a ticket** to vote on (title and optional description)
3. **Select your estimate** from the poker cards
4. **Wait for others** to vote (or reveal manually)
5. **View results** with individual votes and average
6. **Start a new round** or add another ticket

## Deployment to Netlify

### 1. Build for Static Export

```bash
npm run build
npm run export
```

### 2. Deploy to Netlify

1. Drag the `out` folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or connect your Git repository for automatic deployments
3. Set build command: `npm run build && npm run export`
4. Set publish directory: `out`
5. Add environment variables in Netlify dashboard

### 3. Custom Domain (Optional)

Configure your custom domain in Netlify settings.

## Project Structure

```
planningpoker/
├── components/           # React components
│   ├── NameEntry.js     # User name input
│   ├── PokerCard.js     # Individual voting card
│   ├── VotingInterface.js # Main voting area
│   ├── UserList.js      # Participants list
│   ├── ResultsDisplay.js # Vote results with countdown
│   └── TicketManager.js # Ticket creation/management
├── contexts/            # React context
│   └── PlanningPokerContext.js # Global state management
├── lib/                 # Utilities
│   ├── firebase.js      # Firebase configuration
│   └── utils.js         # Helper functions
├── pages/               # Next.js pages
│   ├── _app.js         # App wrapper
│   └── index.js        # Main page
└── styles/             # CSS styles
    └── globals.css     # Global styles with Tailwind
```

## Customization

### Poker Card Values

Edit the `POKER_CARDS` array in `lib/utils.js` to customize card values:

```javascript
export const POKER_CARDS = [
  { value: 0, display: '0' },
  { value: 1, display: '1' },
  // Add your custom values...
];
```

### Styling

The app uses Tailwind CSS. Customize colors and styles in:
- `tailwind.config.js` - Theme configuration
- `styles/globals.css` - Custom component styles

### Firebase Security

For production use, consider implementing proper Firebase security rules:

```json
{
  "rules": {
    "session": {
      ".read": true,
      ".write": true,
      ".validate": "newData.hasChildren(['participants', 'currentTicket'])"
    }
  }
}
```

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Real-time**: Firebase Realtime Database
- **Deployment**: Netlify (static export)
- **State Management**: React Context + useReducer

## License

MIT License - feel free to use for your team!

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

Built with ❤️ for Agile teams 