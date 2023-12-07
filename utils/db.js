import mongodb from 'mongodb';
import envLoader from './env_loader';

class DBClient {
  /**
   * creates an instance DBClient
   */
  constructor() {
    envLoader();
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const db = process.env.DB_DATABASE || 'file_manager';
    const url = `mongodb://${host}:${port}/${db}`;

    this.client = new mongodb.MongoClient(url, { useUnifiedTopology: true });
    this.client.connect();
  }

  /**
   * function returns true, if connection is successful
   */
  isAlive() {
    return this.client.isConnected();
  }
  /**
   * @returns number of documents in the collection users
   */

  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  /**
   * @returns number of documents in collection files
   */
  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }
}

export const dbClient = new DBClient();
export default dbClient;
