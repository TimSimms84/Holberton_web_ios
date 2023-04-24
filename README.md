# Holberton Web-Based Instructor Operator Station

## Description

This is a web-based instructor operator station for CymSTAR. This was a capstone project at Holberton Tulsa done by Tim Simms, Trenton Sims, and Blake Stewart. This project uses a Rust based back end to connect to a shared memory segment and a Warp based web server that allows users to read and change variables in the shared memory. The front end is written in React and uses the Material UI framework.


## This repo is not hosting working code

This project isn't meant for public distribution, this repo is for educational purposes only. While the project met it's MVP and is working it requires properity software from CymSTAR which will not be uploaded. This code here is merely to show off our capstone project.


## Rust Shared Memory (Backend and Shared Memroy)

Rust Shared Memory is a program that enables clients to modify shared memory variables and receive periodic updates for those variable values. The program initializes shared memory utilities and starts a Warp server to listen for incoming WebSocket connections.

### Pre-requisites
* Rust (Latest stable Version)
* CymSTAR Shared Memory Library (proprietary)
* CymSTAR Shared Memory Header Files (proprietary)
* CymHOST (proprietary)

### Installation

Rust Shared Memory is designed to be run on CymHOST. Navigate to the rust_shared_memory folder and run the command:

```Rust
cargo build
```

### Confgiuration
This project requires enviroment variables set by CymHOST. It will not compile unless it's ran inside the CymHOST enviroment.

### Usage

Start the Warp server and WebSocket endpoints by running the following command in the project directory:

```Rust
cargo run
```

Code Structure
* build.rs: Compiles and links C code, generates variable_sets/mod.rs.
* main.rs: Initializes shared memory utilities, defines WebSocket routes, starts Warp server.
* websocket.rs: Handles WebSocket connections with handle_connection and handle_updates functions.
* variable_sets/mod.rs: Contains sets of shared memory variables and their types.
* c subdirectory (NOT UPLOADED): Contains C files for shared memory management, including rt_exec.h, shared_memory_seg.c, shared_memory_seg.h, shared_memory.c, shared_memory.h, symlkw.c, and symlkw.h.


## Web IOS (Front End)

# Web-IOS

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
## Requirements

| Requirement | Version | Description |
| --- | --- | --- |
| Node.js | >= 14.x | A JavaScript runtime environment |
| npm | >= 6.x | A package manager for Node.js |
| React | >= 17.x | A JavaScript library for building user interfaces |
| react-dom | >= 17.x | A package that provides DOM-specific methods for React |


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


