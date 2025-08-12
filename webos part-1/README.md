# WebOS - Web-Based Operating System

A modern, macOS-inspired web-based operating system built with pure HTML5, CSS3, and vanilla JavaScript.

## Features

- Clean, minimal macOS-inspired interface
- Responsive design
- Dark/Light mode support
- Dock with application shortcuts
- File upload functionality
- Window management system
- App launcher with search
- Three-layer authentication system
- Core applications:
  - File Explorer
  - Text Editor
  - Calculator
  - Calendar
  - Notes
  - Terminal
  - Settings

## Getting Started

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/webos.git
cd webos
```

2. Install the required Python packages:
```bash
pip install -r requirements.txt
```

3. Create the necessary directories:
```bash
mkdir static assets templates
```

4. Run the server:
```bash
python server.py
```

5. Open your web browser and navigate to:
```
http://localhost:5000
```

## Project Structure

```
webos/
├── app.py              # Main Flask application
├── server.py           # Development server
├── requirements.txt    # Python dependencies
├── static/            # Static files (JS, CSS)
│   ├── js/
│   │   ├── main.js
│   │   └── apps/
│   │       ├── finder.js
│   │       ├── text-editor.js
│   │       ├── calculator.js
│   │       ├── calendar.js
│   │       ├── notes.js
│   │       ├── terminal.js
│   │       └── settings.js
│   └── css/
│       └── styles.css
├── templates/         # HTML templates
│   └── index.html
└── assets/           # Images and other assets
    ├── wallpapers/
    └── logo.png
```

## Development

### Adding New Features

1. Create a new JavaScript file in `static/js/apps/` for your application
2. Add the application to the dock in `templates/index.html`
3. Update `static/js/main.js` to handle the new application
4. Add any necessary backend routes in `app.py`

### Styling

- The main stylesheet is located at `static/css/styles.css`
- Follow the existing design patterns for consistency
- Use CSS variables for colors and other common values

### Backend Development

- The backend is built with Flask
- Add new routes in `app.py`
- Use WebSocket for real-time features
- Follow RESTful API design principles

## Security

- All API endpoints require authentication
- User data is encrypted
- File uploads are validated
- Cross-site scripting (XSS) protection is enabled
- Cross-site request forgery (CSRF) protection is enabled

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by macOS design
- Built with Flask and Socket.IO
- Uses Font Awesome for icons