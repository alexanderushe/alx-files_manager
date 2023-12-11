import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { Queue } from 'bull';
import dbClient from '../utils/db';
// eslint-disable-next-line import/no-named-as-default
import redisClient from '../utils/redis';

const fileQueue = new Queue('file generation');

class FilesController {
  static async postUpload(req, res) {
    const token = req.headers['x-token'];
    const {
      name, type, parentId = '0', isPublic = false, data,
    } = req.body;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data}' });
    }
    let parentFolder;
    if (parentId !== '0') {
      parentFolder = await dbClient.client.db().collection('files').findOne({ _id: ObjectId(parentId), type: 'folder' });
      if (!parentFolder) {
        return res.status(400).json({ error: 'Parent not found' });
      }
    }
    let newFile;
    if (type === 'folder') {
      let folderParentId = '0';
      if (parentId !== '0') {
        folderParentId = parentFolder._id.toString();
      }
      newFile = {
        userId,
        name,
        type,
        isPublic,
        parentId: folderParentId,
      };
    } else {
      const folderPath = process.env.FOLDER_PATH || 'tmp/files_manager';
      const uuid = uuidv4();
      const localPath = path.join(folderPath, uuid);
      const clearData = Buffer.from(data, 'base64');
      await fs.promises.writeFIle(localPath, clearData);
      let fileParentId = '0';
      if (parentId !== '0') {
        fileParentId = parentFolder._id.toString();
      }
      newFile = {
        userId,
        name,
        type,
        isPublic,
        parentId: fileParentId,
        localPath,
      };
    }
    const result = await dbClient.client.db().collection('files').insertOne(newFile);
    // thumbnail generating queue
    if (type === 'image') {
      const fileId = result.insertedId.toString();
      fileQueue.add({
        userId,
        fileId,
      });
    }
    return res.status(201).json({
      id: result.insertedId.toString(),
      userId,
      name,
      type,
      isPublic,
      parentId: newFile.parentId,
    });
  }
}

export default FilesController;
