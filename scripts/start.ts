//

import type { Server } from "http";
import { PORT } from "../src/config/env";
import { app } from "../src/index";
import { logger } from "../src/services/log";

//

let server: Server | undefined;

try {
  server = app.listen(PORT, () => {
    logger.info(`application is listening on port ${PORT}`);
  });
} catch (err) {
  if (server && server.listening) server.close();
  logger.error(err);
  process.exit(1);
}
