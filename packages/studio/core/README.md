
# @opendaw/studio-core

Core audio engine and project management for OpenDAW Studio.

## Overview

This package provides the fundamental audio processing engine, project management, and synchronization capabilities for OpenDAW Studio. It handles real-time audio processing, project state management, and coordination between different audio worklets.

## Features

- **Audio Engine**: Real-time audio processing and routing
- **Project Management**: Project state, persistence, and environment handling
- **Audio Worklets**: Engine, meter, and recording worklets for Web Audio API
- **Synchronization**: Sync log system for real-time collaboration

---

# Written by chat-gpt - not yet reviewed

---

## Installation

```bash
npm install @opendaw/studio-core
```

## Usage

### Basic Engine Setup

```javascript
import { Engine, Project, EngineFacade } from '@opendaw/studio-core';

// Create a new project
const project = new Project();

// Initialize the audio engine
const engine = new Engine(project);

// Create engine facade for UI integration
const engineFacade = new EngineFacade(engine);

// Start the engine
await engine.start();
```

### Project Management

```javascript
import { Project, ProjectEnv } from '@opendaw/studio-core';

// Create project with environment
const env = new ProjectEnv();
const project = new Project(env);

// Work with project data
project.save();
project.load();
```

### Audio Worklets

```javascript
import { EngineWorklet, MeterWorklet, RecordingWorklet } from '@opendaw/studio-core';

// Register worklets with Web Audio API
await audioContext.audioWorklet.addModule('/path/to/engine-processor.js');
await audioContext.audioWorklet.addModule('/path/to/meter-processor.js');
await audioContext.audioWorklet.addModule('/path/to/recording-processor.js');

// Create worklet instances
const engineWorklet = new EngineWorklet(audioContext);
const meterWorklet = new MeterWorklet(audioContext);
const recordingWorklet = new RecordingWorklet(audioContext);
```

## API Reference

### Engine

The main audio processing engine.

- `start()`: Start the audio engine
- `stop()`: Stop the audio engine
- `noteOn(uuid, pitch, velocity)`: Trigger note on event
- `noteOff(uuid, pitch)`: Trigger note off event

### Project

Project state management and persistence.

- `save()`: Save project state
- `load()`: Load project state
- `boxGraph`: Access to the box graph system
- `editing`: Project editing capabilities

### Mixer