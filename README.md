# The Draft Chamber

A modern, interactive fantasy draft lottery application built with React and Firebase. Participants unlock their cards with unique passwords, complete engaging challenges, and reveal their draft positions in real-time.

## 🎯 Overview

The Draft Chamber transforms the traditional fantasy draft lottery into an interactive experience. Each participant receives a password-protected card that unlocks a series of skill-based challenges. Upon completing all challenges, they can "cast" their draft position to reveal where they'll pick in the fantasy draft.

## ✨ Key Features

### 🔒 **Password-Protected Cards**

- Each participant has a unique password stored in Firebase
- Cards remain locked until the correct password is entered
- Real-time synchronization across all connected clients

### 🎮 **Interactive Challenge System**

- **Click Frenzy**: Click 34 times in 5 seconds - test your clicking speed
- **Reaction Time**: Click when the card lights up (sub-250ms required)
- **Memory Match**: Match 5 pairs of cards with only 3 strikes allowed
- **Hold to Cast**: Final 90-second endurance challenge to reveal draft position

### 🌐 **Real-time Synchronization**

- Live updates of participant progress across all devices
- Firebase Firestore integration for instant state changes
- Collaborative viewing experience for draft events

### 📱 **Mobile-Responsive Design**

- Optimized for all screen sizes and devices
- Touch-friendly controls and gestures
- Progressive Web App (PWA) capabilities

### 🎨 **Modern UI/UX**

- Animated CSS creature (Rayquaza-inspired)
- Smooth card flip animations and transitions
- Dark mode support with automatic detection
- Accessible design with keyboard navigation

## 🛠 Technical Stack

- **Frontend**: React 19.1.0 with functional components and hooks
- **Backend**: Firebase Firestore for real-time data synchronization
- **Styling**: SCSS modules with CSS custom properties
- **Build Tool**: Create React App with modern React features
- **Testing**: React Testing Library and Jest
- **Math**: Math.js for challenge calculations

## 📂 Project Structure

```
src/
├── components/
│   ├── App/                    # Main application component
│   ├── Card/                   # Individual participant cards
│   ├── CardGrid/               # Responsive card layout
│   ├── PasswordModal/          # Password entry interface
│   ├── ChallengeModal/         # Challenge management system
│   ├── ChallengeSelection/     # Challenge selection interface
│   ├── ClickFrenzy/           # Speed clicking challenge
│   ├── ReactionTime/          # Reaction timing challenge
│   ├── MemoryMatch/           # Memory matching game
│   ├── HoldToCast/            # Final endurance challenge
│   └── RayquazaCreature/      # Animated CSS creature
├── services/
│   └── participantService.js   # Firebase integration layer
├── firebase.js                 # Firebase configuration
├── App.js                      # App wrapper component
├── index.js                    # React entry point
└── index.css                   # Global styles and CSS variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Firebase project with Firestore enabled

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd the-draft-chamber
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Update `src/firebase.js` with your Firebase configuration

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How It Works

### 1. **Initial State**

- All participant cards are locked with unique passwords
- Cards display participant names and locked status
- Footer shows progress and instructions

### 2. **Password Entry**

- Click a locked card to open the password modal
- Enter the participant's unique password
- Card unlocks and challenge modal opens

### 3. **Challenge Completion**

- Complete 3 out of 3 available challenges in any order
- Each challenge has specific success criteria
- Unlimited attempts with encouraging feedback

### 4. **Final Challenge**

- "Hold to Cast" becomes available after completing all challenges
- Hold button for 90 seconds continuously
- Reveals participant's draft position upon completion

### 5. **Draft Position Reveal**

- Completed cards can be flipped to show draft position
- Real-time updates show overall progress
- Celebration animations for completion

## 🔧 Firebase Data Structure

```javascript
// Firestore Collection: "participants"
{
  "participant-1": {
    id: 1,
    name: "Participant Name",
    password: "unique-password",
    draftPick: 3,
    isLocked: true,
    isCompleted: false,
    unlockedAt: null,
    completedAt: null
  }
}
```

## 🎨 Challenge Details

### Click Frenzy ⚡

- **Objective**: Click 34 times in 5 seconds
- **Difficulty**: Medium
- **Tips**: Use rapid clicking or mobile tapping

### Reaction Time ⏱️

- **Objective**: Click when card lights up (under 250ms)
- **Difficulty**: Easy
- **Tips**: Stay focused and don't click too early

### Memory Match 🧠

- **Objective**: Match 5 pairs with only 3 strikes
- **Difficulty**: Hard
- **Tips**: Remember card positions carefully

### Hold to Cast 🎯

- **Objective**: Hold button for 90 seconds continuously
- **Difficulty**: Final Challenge
- **Tips**: Don't let go or move your finger/mouse

## 🎯 Customization

### Adding New Challenges

1. Create component in `src/components/NewChallenge/`
2. Add to `AVAILABLE_CHALLENGES` in `ChallengeModal.jsx`
3. Update `challengeDescriptions` in `ChallengeSelection.jsx`

### Styling Customization

- Global variables in `src/index.css`
- Component-specific styles in respective `.module.scss` files
- Dark mode variants using CSS custom properties

### Firebase Configuration

- Update participant data structure in Firestore
- Modify `participantService.js` for new fields
- Adjust real-time listeners as needed

## 🏗 Build and Deploy

### Production Build

```bash
npm run build
```

### Firebase Hosting (Optional)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📱 Progressive Web App

The app includes PWA features:

- Service worker for offline functionality
- Web app manifest for installation
- Responsive design for all devices
- Touch-optimized interactions

## 🔍 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watchAll
```

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Issues**

   - Check Firebase configuration in `src/firebase.js`
   - Ensure Firestore is enabled in Firebase Console
   - Verify network connectivity

2. **Challenge Performance**

   - Challenges are optimized for 60fps
   - Use `requestAnimationFrame` for smooth animations
   - Consider device performance limitations

3. **Mobile Responsiveness**
   - Test on various screen sizes
   - Ensure touch targets are appropriate size
   - Check landscape/portrait orientations

## 🔮 Future Enhancements

- **Admin Dashboard**: Manage participants and reset states
- **Sound Effects**: Audio feedback for challenges and interactions
- **Analytics**: Track completion rates and challenge performance
- **Tournament Mode**: Multi-round draft support
- **Custom Challenges**: User-defined challenge parameters
- **Leaderboard**: Compare challenge completion times

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for real-time backend infrastructure
- React team for the excellent framework
- Create React App for streamlined development
- CSS animations inspired by Pokémon Rayquaza

---

**Built with ❤️ for fantasy sports enthusiasts**
