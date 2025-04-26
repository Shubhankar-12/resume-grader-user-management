import mongoose from 'mongoose';
import chalk from 'chalk';
if (process.env.DB_URI === undefined) {
  throw new Error('Please provide a DB_URI in .env');
}
const dbUri: string = process.env.DB_URI;
// console.log('process.env.DB_URI', process.env.DB_URI);
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

/**
 * Creating a singleton class for database connection.
 * Usage: let connection = Connection.getInstance();
 */
export class DataBase {
  private static instance: DataBase | undefined = undefined;
  public connection: mongoose.Connection | undefined;
  /**
   * @return {mongoose.Connection} returns a live connection or throws an error
   */
  private constructor() {
    this.connection = undefined;
  }
  public static getDatabaseConnection(): mongoose.Connection | undefined {
    if (DataBase.instance === undefined) {
      DataBase.instance = new DataBase();
      DataBase.instance.spawnConnection();
    }
    return DataBase.instance.connection;
  }
  private spawnConnection(): void {
    mongoose.connect(dbUri, options)
        .then(() => {
          console.log(chalk.bgGreen('Connected to database'));
        })
        .catch((err) => {
          console.log(
              chalk.bgRed('Error Connecting to the database:', err.message)
          );
        });
    this.connection = mongoose.connection;
  }
}

/**
 * usage
 */
// let conn = DataBase.getDatabaseConnection();
// console.log(conn?.readyState);
