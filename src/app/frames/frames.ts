import { farcasterHubContext } from "frames.js/middleware";
import { imagesWorkerMiddleware } from "frames.js/middleware/images-worker";
import { createFrames } from "frames.js/next";

type State = {
  counter: number;
};

export const frames = createFrames<State>({
  basePath: "/frames",
  initialState: { counter: 0 },
  debug: process.env.NODE_ENV === "development",
  middleware: [
    farcasterHubContext(),
    imagesWorkerMiddleware({
      imagesRoute: "/images",
      secret: process.env.IMAGE_WORKER_SECRET,
    }),
  ],
});
