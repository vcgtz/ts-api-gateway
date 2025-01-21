# API Gateway Implementation in TypeScript
This projects pretends to create a very simple but functional API Gateway to understand a little better how it works.

The API Gateway implements:
- Proxy router
- Rate limit
- Logger
- Simple authentication
- CORS configuration

The stack I used for this project is:
- TypeScript
- Express

NOTE: This project was inspired by this [post](https://snyk.io/blog/how-to-build-secure-api-gateway-node-js/) with a few changes I made, so all the credits are for them.

## Installing the project
Clone it:
```bash
git clone https://github.com/vcgtz/ts-api-gateway.git
```

Enter to the folder:
```bash
cd ts-api-gateway/
```

Generate a `.env` file and fill the missing property `SESSION_SECRET`:
```bash
cp .env.example .env
```

Install the dependencies:
```bash
npm install
```

Run the project:
```bash
npm run watch
```

## How it works
When running the project, a server will be launched by using the port `3000`, so you go to the URL: http://localhost:3000/, you'll receive a JSON like this:
```json
{
  "msg": "Hello World"
}
```

### Defined routes
There are 4 main routes defined within the project:
- `http://localhost:3000/`: The main route of the project. You test it in the previous step.
- `http://localhost:3000/login/`: Simulates a simple login. When you make a request to it, you will be logged in.
- `http://localhost:3000/logout/`: Simulates closing the open session.
- `http://localhost:3000/check-session/`: Check if you are logged in.

All the routes are protected by a rate limit that allows 5 request every 15 minutes. You can check and update this in the file `/src/server/Server.ts`, in the method: `registerMiddlewares()`.
If you reach the allowd request, you are going to start to get a response like this:
```json
{
  "msg": "Too many requests, please try again later."
}
```

### Routing by a proxy
This project also containes two more endpoins:
- `http://localhost:3000/pokemon`
- `http://localhost:3000/rick-and-morty`

Which redirect to the [Pokemon](https://pokeapi.co/) and [Rick and Morty](https://rickandmortyapi.com/) public APIs.

This proxy router is defined in the file `/src/server/Server.ts`, in the method: `registerProxyRoutes()`.

Here you have an exmaple of how this works:
- Click on http://localhost:3000/pokemon/pikachu
- Click on http://localhost:3000/rick-and-morty?name=rick
