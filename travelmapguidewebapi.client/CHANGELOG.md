This file explains how Visual Studio created the project.

The following tools were used to generate this project:
- create-vite

The following steps were used to generate this project:
- Create react project with create-vite: `npm init --yes vite@latest travelmapguidewebapi.client -- --template=react`.
- Update `vite.config.js` to set up proxying and certs.
- Update `App` component to fetch and display weather information.
- Create project file (`travelmapguidewebapi.client.esproj`).
- Create `launch.json` to enable debugging.
- Create `nuget.config` to specify location of the JavaScript Project System SDK (which is used in the first line in `travelmapguidewebapi.client.esproj`).
- Add project to solution.
- Add project to the startup projects list.
- Write this file.
