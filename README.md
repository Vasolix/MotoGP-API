
# MotoGP API

[![npm version](https://img.shields.io/npm/v/motogp-api)](https://www.npmjs.com/package/motogp-api)

A simple and efficient TypeScript wrapper for the official MotoGP API.

## Installation

```bash
npm install motogp-api
# or
bun add motogp-api
```

## Usage

```typescript
import { MotoGPClient } from 'motogp-api';

const client = new MotoGPClient();

// Get riders
const riders = await client.getRiders();

// Get seasons
const seasons = await client.getSeasons();
```

## Development scripts

```bash
# Build the project
bun run build

# Run tests
bun test

# Lint the code
bun run lint
```

## License

MIT