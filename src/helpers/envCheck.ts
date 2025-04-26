/**
 * to check if we have all the required environment variable
 */
function checkEnvVariables(): void {
  const common = " is missing from process env";
  try {
    if (process.env.DB_URI === undefined) {
      throw new Error("DB_URI" + common);
    }
    if (process.env.PORT === undefined) {
      throw new Error("PORT" + common);
    }
    if (process.env.OWNER_POLICY_JWT_KEY === undefined) {
      throw new Error("OWNER_POLICY_JWT_KEY" + common);
    }
    if (process.env.ADMIN_POLICY_JWT_KEY === undefined) {
      throw new Error("ADMIN_POLICY_JWT_KEY" + common);
    }
    // if (process.env.PASSWORD_SECRET_KEY === undefined) {
    //   throw new Error("PASSWORD_SECRET_KEY" + common);
    // }
    if (process.env.LOG_IN_DB === undefined) {
      throw new Error("LOG_IN_DB" + common);
    }
    if (process.env.LOG_IN_FILE === undefined) {
      throw new Error("LOG_IN_FILE" + common);
    }
    // if (process.env.ACCESS_KEY_ID === undefined) {
    //   throw new Error("LOG_IN_FILE" + common);
    // }
    // if (process.env.SECRET_ACCESS_KEY === undefined) {
    //   throw new Error("LOG_IN_FILE" + common);
    // }
    // if (process.env.REGION === undefined) {
    //   throw new Error("LOG_IN_FILE" + common);
    // }
    // if (process.env.AWS_BUCKET_NAME === undefined) {
    //   throw new Error("LOG_IN_FILE" + common);
    // }
  } catch (err: any) {
    console.log(err.message);
    process.exit(1);
  }
}

export { checkEnvVariables };
