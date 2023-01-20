# mqtt-custom-dashboard-node-js
A custom MQTT dashboard built using Node.js that can be used to display sensor readings from a BME280 sensor  
![Featured Image - Custom MQTT Dashboard](https://user-images.githubusercontent.com/69466026/213635253-3e988d9e-bc5b-49fe-9ef5-d1bfcd38075b.jpg)  
  
## Write up  
[How to build your own custom MQTT dashboard?](https://www.donskytech.com/how-to-build-your-own-custom-mqtt-dashboard/)  
  
  
## How to run
You should have Node.js installed in your workstation 

Clone the repository  
``` git clone https://github.com/donskytech/mqtt-custom-dashboard-node-js.git ```  
``` cd mqtt-custom-dashboard-node-js ``` 

Rename the .env.local to .env  
``` mv .env.local .env ```  

Edit the .env and set the MQTT broker URL that you are using  
```
NAME=DONSKYTECH
DASHBOARD_TITLE=MQTT DASHBOARD
MQTT_BROKER=ws://127.0.01:9001/mqtt
MQTT_TOPIC=sensorReadings
```  

Install the dependencies and run the project
``` npm install && npm run dev ```
