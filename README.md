# 🎨 Custom QR Code Generator

A beautiful, feature-rich QR code generator with extensive customization options including colors, icons, borders, shadows, and more.

## ✨ Features

- **Custom Colors**: Choose any foreground and background colors
- **Icon Support**: Add custom icons/logos to the center of your QR codes
- **Border Styling**: Multiple border styles (solid, dashed, dotted, double) with custom colors and widths
- **Shape Customization**: Adjustable border radius for rounded corners
- **Shadow Effects**: Optional drop shadows for depth
- **Size Control**: Adjustable QR code size from 200px to 800px
- **Error Correction**: Multiple error correction levels for different use cases
- **Live Preview**: Real-time updates as you adjust settings
- **Download Support**: Save your QR codes as PNG images
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites
- A modern web browser
- Python 3.x (for local server) or any web server

### Installation

1. **Clone or download this project**
   ```bash
   git clone <repository-url>
   cd qr-gen
   ```

2. **Start a local server**
   
   **Option 1: Using Python (recommended)**
   ```bash
   python -m http.server 8000
   ```
   
   **Option 2: Using Node.js**
   ```bash
   npx http-server -p 8000
   ```
   
   **Option 3: Using PHP**
   ```bash
   php -S localhost:8000
   ```

3. **Open your browser**
   Navigate to `http://localhost:8000`

## 🎯 How to Use

1. **Enter Content**: Type or paste the text/URL you want to encode
2. **Customize Appearance**: 
   - Adjust size, colors, and margins
   - Add borders and shadows
   - Upload a custom icon
3. **Generate**: Click "Generate QR Code" to create your custom QR code
4. **Download**: Save your QR code as a PNG image

## 🎨 Customization Options

### Basic Settings
- **Content**: Any text, URL, or data
- **Size**: 200px to 800px
- **Error Correction**: Low, Medium, Quartile, or High
- **Margin**: White space around the QR code

### Visual Styling
- **Colors**: Custom foreground and background colors
- **Borders**: Style, width, and color customization
- **Border Radius**: Rounded corners (0-50px)
- **Shadows**: Optional drop shadow effects

### Advanced Features
- **Icons**: Upload custom logos/icons for the center
- **Icon Size**: Adjustable from 20% to 100% of QR code size
- **Live Updates**: Real-time preview as you make changes

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + Enter`: Generate QR code
- `Ctrl/Cmd + S`: Download QR code (when available)

## 🛠️ Technical Details

### Dependencies
- **QRCode.js**: For QR code generation
- **Modern CSS**: Grid, Flexbox, and CSS custom properties
- **Vanilla JavaScript**: No frameworks required

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 Mobile Support

The interface is fully responsive and works great on mobile devices with touch-friendly controls.

## 🎨 Example Use Cases

- **Business Cards**: Professional QR codes with company logos
- **Marketing Materials**: Branded QR codes with custom colors
- **Event Tickets**: QR codes with event branding
- **Social Media**: Custom QR codes for profiles and links
- **Product Packaging**: Branded QR codes for product information

## 🔧 Customization

You can easily customize the appearance by modifying the CSS variables in `styles.css`:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --background-color: #f8f9fa;
  --text-color: #333;
}
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📞 Support

If you encounter any issues or have questions, please open an issue on the project repository.

---

**Happy QR Code Generating! 🎉**
