# Dataskop: Measurement Monitor
This application is specifically tailored for tasks in debugging and monitoring. It allows users to input file paths corresponding to measurement results from the Dataskop backend. Each measurement can be uniquely identified by assigning a custom sensor name or label. Additionally, users have the option to assign different colors to each measurement for better visual differentiation.

The application is capable of handling multiple data paths simultaneously (**Fig. 1 - A**). For each path entered, it fetches the corresponding data and presents the results in individual tables (**Fig. 2 - A**), ensuring a clear and organized display of information. One of the key features is its automatic data refresh mechanism, which is set by default to occur every 5 seconds (**Fig. 2 - B**). This interval is flexible and can be adjusted according to the user's needs for all the paths that are being monitored at any given time.

In terms of user session management, the application offers a convenient feature of locally storing the current working session in the user's browser. This ensures that users can easily resume their work or revert to previous settings without losing any progress. For added convenience, the application provides a 'History' feature, which stores up to the last 15 sessions. Users can easily access and continue their work from these saved sessions (**Fig. 1 - B**).

The application requires an integration with the Dataskop backend, including the necessary access token. However, its utility extends beyond this specific backend; it is designed to be compatible with any API that requires an access token for access and returns data in a JSON format, particularly those containing "timestamp" and "value" properties. This makes it a versatile tool for various applications in data monitoring and debugging across different platforms and systems.

![Figure 1](https://github.com/Dataskop/dataskop-mesurement-monitor/blob/main/Datainput-page.png)
*Figure 1: Showing the data input page*

![Figure 2](https://github.com/Dataskop/dataskop-mesurement-monitor/blob/main/Sensor-tables.png)
*Figure 2: Showing the seonsor tables page*

## Hosted Version
[x](x)

## Features

- Dark mode
- Responsive
- Path Input for Measurement Results
- Custom Naming for Sensors/Measurements
- Color Customization
- Simultaneous Multiple Path Handling
- Adjustable Data Refresh Rate
- Local Session Storage
- History Feature for Session Retrieval
- API Compatibility
- Organized Data Presentation
- User-Friendly Interface




## Installation

Assuming you cloned or downloaded the repository, follow these instructions:

```bash
  cd dataskop-mesurement-monitor
```
then

```bash
  npm install dataskop-mesurement-monitor

  # OR
  
  yarn install dataskop-mesurement-monitor
```
afterwards
```bash
  npm run dev

  # OR

  yarn run dev
 ```

    
## Technologies

 - [Vite](https://vitejs.dev/)
 - [React](https://react.dev/)
 - [Bootstrap](https://getbootstrap.com/)
 - [SweetAlert2](https://sweetalert2.github.io/)

