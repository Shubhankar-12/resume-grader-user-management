import { startServer } from "./app";

const PORT: number = Number(process.env.PORT) || 3000;
const HOST = "192.168.29.137"; // important

startServer();

function listener() {
  setTimeout(() => {
    const message = `User-Management Server is listening on ${PORT}`;
    console.log(message);
    global.logger.log("info", message);
    global.dbLogger.log({
      level: "info",
      category: "info",
      data: message,
    });
  }, 500);
}
