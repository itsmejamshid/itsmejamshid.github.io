# Personal Website

A minimal, clean personal website inspired by sites like paulgraham.com and nav.al.

## Features

- **Minimal Design**: Clean white and black/gray theme with excellent typography
- **Single Page Application**: Smooth navigation between sections without page reloads
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Accessible**: Proper semantic HTML, keyboard navigation, and focus indicators
- **Fast**: Lightweight with no external dependencies except Google Fonts

## Sections

- **Home**: Introduction and overview
- **Projects**: Showcase of your work with links to GitHub and live demos
- **Essays**: Blog posts or articles you've written
- **Contact**: Ways to get in touch with you

## Customization

### Personal Information
Edit `index.html` to update:
- Your name (currently "Your Name")
- Age and title
- Introduction text
- Project details
- Essay content
- Contact links

### Styling
The design uses a clean, minimal approach with:
- Inter font from Google Fonts
- Clean spacing and typography
- Subtle hover effects
- Smooth transitions

### Colors
The color scheme is intentionally minimal:
- Text: Various shades of gray (`#1a202c`, `#2d3748`, `#4a5568`, `#718096`)
- Background: Pure white (`#ffffff`)
- Accents: Light gray borders (`#e2e8f0`)

## Running Locally

Since this is a static website, you can:
1. Open `index.html` directly in your browser, or
2. Use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

## Deployment

This website can be deployed to any static hosting service:
- **GitHub Pages**: Push to a repository and enable Pages
- **Netlify**: Drag and drop the folder or connect to GitHub
- **Vercel**: Import from GitHub or deploy directly
- **Surge**: `npm install -g surge && surge`

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers

## License

Feel free to use this template for your own personal website. No attribution required.