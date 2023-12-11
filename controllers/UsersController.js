// import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
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

  //   /**
  //    *
  //    * Should retrieve the user base on the token used
  //    *
  //    * Retrieve the user based on the token:
  //    * If not found, return an error Unauthorized with a
  //    * status code 401
  //    * Otherwise, return the user object (email and id only)
  //    */
  //   static async getMe(request, response) {
  //     const { userId } = await userUtils.getUserIdAndKey(request);

  //     const user = await userUtils.getUser({
  //       _id: ObjectId(userId),
  //     });

  //     if (!user) return response.status(401).send({ error: 'Unauthorized' });

  //     const processedUser = { id: user._id, ...user };
  //     delete processedUser._id;
  //     delete processedUser.password;

//     return response.status(200).send(processedUser);
//   }
}

export default UsersController;
