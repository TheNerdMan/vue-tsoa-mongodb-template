// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

// Global Variables
export const collections: {
  users?: mongoDB.Collection;
} = {};

// Initialize Connection
export async function connectToDatabase() {
  dotenv.config();

  const requiredEnvVars = {
    DB_CONN_STRING: process.env.DB_CONN_STRING,
    DB_NAME: process.env.DB_NAME,
    USERS_COLLECTION_NAME: process.env.USERS_COLLECTION_NAME,
  };

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      throw new Error(
        `Environment variable ${key} is not set. Check your .env file.`
      );
    }
  }

  let connString = requiredEnvVars.DB_CONN_STRING;

  if (process.env.DB_USERNAME && process.env.DB_PASSWORD) {
    connString = connString!.replace(
      "mongodb://",
      `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@`
    );
  }

  const safeToLogConnString = connString!.replace(
    /:(.*)@/,
    ":***:***@"
  );
  console.log(
    `Connecting to database with connection string: ${safeToLogConnString}`
  );
  console.log(`Database Name: ${requiredEnvVars.DB_NAME}`);

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(connString!);

  await client.connect();

  const db: mongoDB.Db = client.db(requiredEnvVars.DB_NAME);

  const usersCollection: mongoDB.Collection = db.collection(
    requiredEnvVars.USERS_COLLECTION_NAME!
  );

  collections.users = usersCollection;

  console.log(
    `Successfully connected to database: ${db.databaseName} and collections`
  );
}
