# Clipboard History Manager

A real-time clipboard history tracker that monitors and manages your clipboard activities with context awareness. Built for the Screenpipe Hackathon.

## What it Does

This app keeps track of everything you copy, showing you:
- The copied text
- When it was copied
- Which app it came from
- The source URL (if copied from web)
- Related suggestions

## Features

- 📋 **Live Monitoring**: Automatically tracks clipboard changes in real-time
- 🔍 **Instant Search**: Search through your clipboard history
- 🔄 **One-Click Copy**: Click any entry to copy it back to your clipboard
- 📊 **Copy Counter**: Tracks how many items you've copied
- 🔔 **Toast Notifications**: Get notifications when items are copied
- 🎯 **Task Grouping**: Organizes copies by source application
- 💡 **Smart Context**: Shows related suggestions and source URLs

## Tech Stack

- Next.js 14
- React
- TypeScript
- Custom Toast System
- Clipboard API

## Getting Started

1. Clone the repository:

   bash
git clone https://github.com/muhnehh/clipboard-history-pipe.git


2. Install dependencies:
   bash
npm install


3. Run the development server:
   bash
npm run dev


4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. Start copying text from anywhere
2. The app will automatically track your copies
3. Use the search bar to find specific copies
4. Click any entry to copy it back to your clipboard
5. See notifications when items are copied
6. View source information and suggestions for each copy

## Implementation Details

- Uses Next.js App Router for modern React architecture
- Client-side clipboard monitoring with error handling
- Custom toast notification system
- Responsive design that works on all devices
- SSR-friendly implementation with hydration handling

## Built For

This project was built for the Screenpipe Hackathon, demonstrating the power of clipboard management and context awareness.

## Author

[@muhnehh](https://github.com/muhnehh)

## License

MIT License - Feel free to use and modify!

---
Built with [Screenpipe](https://screenpi.pe) 🚀
