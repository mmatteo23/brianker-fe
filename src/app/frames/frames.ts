import { farcasterHubContext } from "frames.js/middleware";
import { imagesWorkerMiddleware } from "frames.js/middleware/images-worker";
import { createFrames } from "frames.js/next";

export const frames = createFrames({
  basePath: "/frames",
  debug: process.env.NODE_ENV === "development",
  middleware: [
    farcasterHubContext(),
    imagesWorkerMiddleware({
      imagesRoute: "/images",
      secret: process.env.IMAGE_WORKER_SECRET,
    }),
  ],
});
