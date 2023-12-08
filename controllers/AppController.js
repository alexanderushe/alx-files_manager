import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AppController {
  /**
   * return if Redis is alive & if the DB is alive too
   * uses 2 utils
   * {'redis': true, 'db': true} status code 200
   */

  static async getStatus(req, res) {
    try {
      const isRedisAlive = await redisClient.isAlive();
      const isDBAlive = await dbClient.isAlive();

      res.status(200).json({
        redis: isRedisAlive,
        db: isDBAlive,
      });
    } catch (error) {
      console.error('Error in getStatus:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * should return the {number} of users & files
   * in DB {'users: 12, 'files': 1231}
   * status code 200
   */

  static async getStat(req, res) {
    const stats = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    };
    res.status(200).send(stats);
  }
}

export default AppController;
