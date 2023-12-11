import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
// eslint-disable-next-line import/no-named-as-default
import redisClient from '../utils/redis';
// import userUtils from '../utils/user';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
    const collection = dbClient.client.db().collection('users');
    const userExists = await collection.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }
    const userId = uuidv4();
    const hashedPassword = sha1(password);
    const result = await collection.insertOne({
      id: userId,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({ id: result.insertedId, email });
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let user;
    try {
      user = await dbClient.client
        .db()
        .collection('users')
        .findOne({ _id: ObjectId(userId) });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!user) {
      console.error(`User not found for id: ${userId}`);
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(200).json({ id: user._id, email: user.email });
  }
}

export default UsersController;
