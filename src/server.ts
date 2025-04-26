import { app } from "./app";

const PORT = process.env.PORT;

app.listen(PORT, listener);
function listener() {
  setTimeout(() => {
    const message = `User-Management Server is listening on PORT ${PORT}`;
    console.log(message);
    global.logger.log("info", message);
    global.dbLogger.log({
      level: "info",
      category: "info",
      data: message,
    });
  }, 500);
}
