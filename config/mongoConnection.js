import { MongoClient } from "mongodb";
import settings from "./settings";
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

export default async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    _db = await _connection.db(mongoConfig.database);
  }

  return _db;
};
