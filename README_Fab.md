This is the document for multi container Course. 
We will build a complex multi container app to calculate fibonacci number

UI: 
input number textbox   get number bottom
List of visisted numbers
Results for each. 

User => React APP (client)=> Express Server (server) => 
1 Postgres DB, save new visisted number. 
2 Redis server, catch result for visited number <=> Node js worker (worker) if income number is new. 