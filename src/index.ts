import app from "./server.ts";
import env from "../env.ts";

console.log(`
    APP_STAGE: ${env.APP_STAGE}
    NODE_ENV: ${env.NODE_ENV}
  `);

app.listen(env.PORT, () => {
  console.log("Server running on port 3000");
});
