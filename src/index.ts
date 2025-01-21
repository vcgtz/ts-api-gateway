import dotenv from 'dotenv';
import Server from './server/Server';

dotenv.config();

const server: Server = new Server();
server.run();
