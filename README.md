# 🧠 Recall
### A full-stack personal knowledge management application with GPU-accelerated semantic search and Firestore vector search.

## 📋 Table of Contents
- [Features](#-features)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)

## 🔍 Overview

**Recall** is a full-stack notes application designed for storing,
organizing, and _semantically searching_ personal notes.

Unlike traditional keyword-based search, the application uses
sentence embeddings and Firestore Vector Search to retrieve notes
based on their _semantic meaning_.

## ✨ Key Features

- 📝 Rich-text note editing with TipTap
- 🔐 Firebase Authentication
- 📂 Custom categories
- 📌 Pin, archive, trash and restore workflows
- 🔎 Semantic search using vector embeddings
- 🧵 Asynchronous embedding pipeline with multiple workers
- ⚡ GPU-accelerated embedding generation
- ⏱️ Backend embedding debounce and job deduplication
- 🔒 Multi-user data isolation
- 🌗 Dark and light themes
- 📱 Responsive UI

## 📺 Screenshots

| | | | |
| :----: | :---: | :---: | :---: |
| ![Home](assets/home.png) | ![Dashboard Dark Mobile](assets/dash%20dark%20mob.png) | ![Viewer Light](assets/viewer%20light%20mob.png) | ![Editor Dark](assets/editor%20dark%20mob.png) |

| | |
| :---: | :---: |
| ![Search Light](assets/search%20light.png) | ![Dashboard Dark](assets/dash%20dark.png) |
| ![Viewer Dark](assets/viewer%20dark.png) | ![Editor Light](assets/editor%20light.png) |


## 🏗️ Architecture
<p align="center">
  <img alt="Recall System Architecture Dark" src="assets/architecture/dark.svg#gh-dark-mode-only" width="100%">
  <img alt="Recall System Architecture Light" src="assets/architecture/light.svg#gh-light-mode-only" width="100%">
</p>

## 🚀 Performance

### Embedding performance was measured locally using:
- Model: all-MiniLM-L6-v2
- Hardware: rtx 2050 (2048 CUDA cores)
- Framework: SentenceTransformers / PyTorch
- CUDA acceleration enabled

| Configuration        |       Throughput |
| -------------------- | ---------------: |
| Individual inference | ~50–70 notes/sec |
| Batched inference    |   ~700 notes/sec |

> These are local measurements and depend on hardware, batch size,
> note length, and other runtime conditions.

## ⚙️ Installation
Provide step-by-step instructions to get the local development environment running.

```bash
# Clone the repository
git clone https://github.com

# Navigate to the project directory
cd project-name

# Install dependencies
npm install # or pip install -r requirements.txt
```

## 💼 Usage
Show examples of how to run, execute, or interact with your application.

```bash
# Start the development server
npm start
```
Include screenshots or an animated GIF here to visually demonstrate the app working!

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request for any changes.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
