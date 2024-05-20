import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const cluster = process.env.MONGO_CLUSTER;
const database = process.env.MONGO_DATABASE;

const mongoString = `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`;

mongoose.connect(mongoString);

const options = {
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

export const db = mongoose.connect(mongoString, options).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error(err);
});