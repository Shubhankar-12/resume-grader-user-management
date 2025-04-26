/* eslint-disable @typescript-eslint/no-explicit-any */
import mongodb from "mongodb";
import { MongoClient, Db, Collection } from "mongodb";

const Client = MongoClient;

interface LogOptions {
  /**
   * Levels are for the severity of the situation.
   * Some levels are 1. Info, 2. Warn, 3. Error
   */
  level: string;
  /**
   * Category helps to collection the reason for the log
   * for e.g. category will have values like request, response, warning, error
   */
  category: string;
  /**
   * data to be stored for the log
   * Could be a whole incoming request, or the stack trace.
   */
  data: unknown;
}

const log_collection_name = "logs";
const general_error_log_collection_name = "error-logs";

const DB_URI: string = process.env.DB_URI ? process.env.DB_URI : "";

class DataBaseLogger {
  client: MongoClient | undefined;
  db: Db | undefined;
  logsCollection: Collection | undefined;
  generalErrorsCollection: Collection | undefined;
  async connect(): Promise<void> {
    this.client = await Client.connect(DB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // unif,
    });
    this.db = this.client.db();
    this.logsCollection = this.db.collection(log_collection_name);
    this.generalErrorsCollection = this.db.collection(
      general_error_log_collection_name
    );
  }
  async log(options: LogOptions): Promise<mongodb.InsertOneResult<any>> {
    if (this.logsCollection === undefined) {
      throw new Error(log_collection_name + " Collection not initialized");
    }
    return await this.logsCollection.insertOne(options);
  }

  async logError(options: LogOptions): Promise<mongodb.InsertOneResult<any>> {
    if (this.generalErrorsCollection === undefined) {
      throw new Error(
        general_error_log_collection_name + "Collection not initialized"
      );
    }
    return await this.generalErrorsCollection.insertOne(options);
  }
}

export { DataBaseLogger };
