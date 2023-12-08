import { Db, MongoClient } from "mongodb";
import settings from "./settings.js";
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

/**
 * @returns {Promise<Db>}
 */
export default async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = await _connection.db(mongoConfig.database);
  }

  return _db;
};
