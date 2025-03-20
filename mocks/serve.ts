import { setupServer } from "msw/node";
import type { Server } from "node:http";
import { entrepriseHandlers } from "./entreprise.api.gouv.fr";
import { FranceconnectFrontChannel } from "./oidc.franceconnect.gouv.fr";

console.log("[🎭] Opening to mockery theater");

let frontChannelServer: Server | undefined;
try {
  frontChannelServer = FranceconnectFrontChannel.listen(8600);
} catch (error) {
  if (frontChannelServer && frontChannelServer.listening)
    frontChannelServer.close();
  console.error("[🎭] Front channel server error");
  console.error(error);
}

const server = setupServer(...entrepriseHandlers);

server.events.on("request:start", ({ request }) => {
  console.log(`[🎭] <- ${request.method} ${request.url}`);
});

server.events.on("request:end", ({ request }) => {
  console.log(`[🎭] -> ${request.method} ${request.url}`);
});

server.listen();

// Cleanup function to stop both servers
export function cleanup() {
  console.log("[🎭] Closing the theater");
  server.close();
  frontChannelServer?.close();
}
