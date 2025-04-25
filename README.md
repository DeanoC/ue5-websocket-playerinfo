# UE5 Player Stats Monitor

An Electron application that connects to Unreal Engine 5 games via WebSockets to display real-time player statistics.

## Features

- Real-time display of player stats from UE5 games
- WebSocket server that UE5 games can connect to
- Automatic updates of player stats every second
- Support for custom player stats

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Unreal Engine 5

## Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

## Usage

### Running the Electron App

To run the app in development mode:

```bash
npm run electron:dev
```

To build the app for production:

```bash
npm run electron:build
```

### Connecting from UE5

1. Add the WebSockets plugin to your UE5 project:
   - Open your UE5 project
   - Go to Edit > Plugins
   - Search for "WebSockets" and enable it
   - Restart the editor if prompted

2. Implement the WebSocket client in your UE5 project:
   - Use the provided `UE5_WebSocket_Example.cpp` as a reference
   - Create a WebSocket client that connects to `ws://localhost:8080`
   - Send player stats as JSON in the format expected by the Electron app

3. Send player stats from your game:
   - Update player stats every second (or at your preferred interval)
   - Format the stats as JSON with the following structure:

```json
{
  "health": 100,
  "mana": 75,
  "stamina": 90,
  "position": {
    "x": 123.45,
    "y": 67.89,
    "z": 10.11
  },
  "level": 5,
  "experience": 1234,
  "customStat1": 42,
  "customStat2": 99
}
```

## Player Stats Format

The Electron app expects player stats in the following format:

| Field | Type | Description |
|-------|------|-------------|
| health | number | Player's health points |
| mana | number | Player's mana points |
| stamina | number | Player's stamina points |
| position | object | Player's position in the game world |
| position.x | number | X coordinate |
| position.y | number | Y coordinate |
| position.z | number | Z coordinate |
| level | number | Player's level |
| experience | number | Player's experience points |
| [custom] | any | Any additional stats you want to display |

## Development

### Project Structure

- `electron/` - Electron main process code
  - `main.ts` - Main process entry point
  - `preload.ts` - Preload script for secure IPC
- `src/` - Renderer process code
  - `main.ts` - Renderer process entry point
- `public/` - Static assets
- `UE5_WebSocket_Example.cpp` - Example UE5 WebSocket client code

### Modifying the UI

The UI is built with HTML, CSS, and TypeScript. To modify the UI:

1. Edit `index.html` to change the layout
2. Edit `src/main.ts` to change the functionality
3. Run `npm run electron:dev` to see your changes

## License

MIT