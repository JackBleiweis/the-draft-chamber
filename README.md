# Fantasy Draft Lottery UI

A clean, modern React UI for a fantasy draft lottery application. This project provides a responsive card-based interface for displaying participants in a draft lottery system.

## Features

- **Responsive Design**: 2x5 grid layout that adapts to different screen sizes
- **Modern UI**: Clean, card-based design with hover effects and animations
- **Dark Mode Support**: Automatic dark mode based on user preferences
- **Interactive Cards**: Cards can be flipped and have locked states
- **SCSS Modules**: Modular, maintainable styling
- **Accessibility**: Keyboard navigation and screen reader support
- **TypeScript Ready**: Component structure ready for TypeScript migration

## Project Structure

```
src/
├── components/
│   ├── App/
│   │   ├── App.jsx
│   │   └── App.module.scss
│   ├── Card/
│   │   ├── Card.jsx
│   │   └── Card.module.scss
│   ├── CardGrid/
│   │   ├── CardGrid.jsx
│   │   └── CardGrid.module.scss
│   └── PasswordModal/
│       ├── PasswordModal.jsx
│       └── PasswordModal.module.scss
├── App.js              # Main app wrapper
├── index.js            # Entry point
└── index.css           # Global styles
```

## Component Overview

### Card Component

- **Purpose**: Individual participant card with flip animation
- **States**:
  - `isLocked`: Prevents interaction and shows locked state
  - `isFlipped`: Shows the back of the card
- **Props**:
  - `participant`: Object with `id`, `name`, `isLocked`, `isFlipped`
  - `onClick`: Function called when card is clicked

### CardGrid Component

- **Purpose**: Responsive grid layout for organizing cards
- **Layout**: 2x5 grid (desktop) → 4x3 (tablet) → 3x4 (mobile) → 2x5 (small mobile)
- **Props**:
  - `participants`: Array of participant objects
  - `onCardClick`: Function called when any card is clicked

### PasswordModal Component

- **Purpose**: Modal for password entry (UI only)
- **Features**: Form validation, accessibility, responsive design
- **Props**:
  - `isOpen`: Boolean to control modal visibility
  - `onClose`: Function called when modal is closed
  - `onSubmit`: Function called when form is submitted

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Basic Implementation

The app currently uses mock data for 10 participants. To integrate with your backend:

1. Replace the `mockParticipants` array in `App.jsx` with your API data
2. Update the `handleCardClick` function to implement your business logic
3. Add state management (Context API or Redux) for complex state

### Customization

#### Styling

- Global styles and CSS variables are in `src/index.css`
- Component-specific styles use SCSS modules
- Dark mode colors are defined in CSS custom properties

#### Adding New Features

- Create new components in `src/components/ComponentName/`
- Follow the established naming convention
- Use SCSS modules for styling
- Implement proper TypeScript types (when migrating)

## Card States

### Default State

- Interactive card with hover effects
- Shows participant name and ID
- Click to flip the card

### Locked State

- Grayed out appearance
- Non-interactive (cursor: not-allowed)
- Shows lock icon
- Cannot be flipped

### Flipped State

- Shows card back with decorative pattern
- 3D flip animation
- Can be flipped back to front

## Responsive Breakpoints

- **Desktop (>1024px)**: 5x2 grid
- **Tablet (768px-1024px)**: 4x3 grid
- **Mobile (480px-768px)**: 3x4 grid
- **Small Mobile (360px-480px)**: 2x5 grid
- **Extra Small (<360px)**: 1x10 grid

## Development

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use SCSS modules for styling
- Implement proper error boundaries
- Add PropTypes or TypeScript for type safety

### Testing

- Unit tests for components
- Integration tests for user interactions
- Accessibility testing
- Cross-browser compatibility

### Future Enhancements

- Add React Context for state management
- Implement drag-and-drop functionality
- Add sound effects and animations
- Create admin interface for managing participants
- Add real-time updates with WebSockets

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Optimized for 60fps animations
- Lazy loading ready
- Minimal bundle size
- Efficient re-renders with React.memo (when needed)
