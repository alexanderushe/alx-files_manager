import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

/**
 * Class for performing operations with Mongo service
 */
class DBClient {
  constructor() {
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (!err) {
        // console.log('Connected successfully to server');
        this.db = client.db(DB_DATABASE);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
      } else {
        console.error('MongoDB connection error:', err.message);
        this.db = false;
      }
    });
  }

  /**
   * Checks if connection to Redis is Alive
   * @return {boolean} true if connection alive or false if not
   */
  isAlive() {
    return Boolean(this.db);
  }

  /**
   * Returns the number of documents in the collection users
   * @return {number} amount of users
   */
  async nbUsers() {
    try {
      const numberOfUsers = await this.usersCollection.countDocuments();
      return numberOfUsers;
    } catch (err) {
      console.error('Error counting users:', err.message);
      throw err; // this re throws the error to be caught by the caller
    }
  }

  /**
   * Returns the number of documents in the collection files
   * @return {number} amount of files
   */
  async nbFiles() {
    try {
      const numberOfFiles = await this.filesCollection.countDocuments();
      return numberOfFiles;
    } catch (err) {
      console.error('Error counting files:', err.message);
      throw err;
    }
  }
}

const dbClient = new DBClient();

export default dbClient;
