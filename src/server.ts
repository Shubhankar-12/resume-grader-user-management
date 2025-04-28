import { app } from "./app";

const PORT: number = Number(process.env.PORT) || 3000;
const HOST = "192.168.29.137"; // important

app.listen(PORT, HOST, listener);

function listener() {
  setTimeout(() => {
    const message = `User-Management Server is listening on http://${HOST}:${PORT}`;
    console.log(message);
    global.logger.log("info", message);
    global.dbLogger.log({
      level: "info",
      category: "info",
      data: message,
    });
  }, 500);
}
