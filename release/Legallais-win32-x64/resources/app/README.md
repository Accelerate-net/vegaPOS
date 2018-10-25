# Accelerate Vega POS

This is a minimal desktop POS application built using Electron using Pouch DB and File Systems as local data storage and Apache Couch DB as Server data storage.

**You would need to have access to the [Accelerate APIs](http://www.accelerate.net.in/vega) to use this application along with the local setup.**

This application contains these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.

## To Setup

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/Accelerate-net/vegaPOS
# Go into the repository
cd vegaPOS
# Install dependencies
npm install
# Make customisations and run the app
npm start
```

## Help
support@accelerate.net.in
