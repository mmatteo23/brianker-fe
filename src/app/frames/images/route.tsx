import { createImagesWorker } from "frames.js/middleware/images-worker/next";
import path from "node:path";
import { readFileSync } from "node:fs";

const regularFontData = readFileSync(
  path.join(path.resolve(process.cwd(), "public"), "Inter-Regular.ttf")
);

const boldFontData = readFileSync(
  path.join(path.resolve(process.cwd(), "public"), "Inter-Bold.ttf")
);

const regularChakraPetchFontData = readFileSync(
  path.join(path.resolve(process.cwd(), "public"), "ChakraPetch-Regular.ttf")
);

const boldChakraPetchFontData = readFileSync(
  path.join(path.resolve(process.cwd(), "public"), "ChakraPetch-Bold.ttf")
);

const imagesWorker = createImagesWorker({
  secret: process.env.IMAGE_WORKER_SECRET,
  imageOptions: {
    debug: false,
    fonts: [
      {
        data: regularFontData,
        name: "Inter-Regular",
      },
      {
        data: boldFontData,
        name: "Inter-Bold",
      },
      {
        data: regularChakraPetchFontData,
        name: "ChakraPetch-Regular",
      },
      {
        data: boldChakraPetchFontData,
        name: "ChakraPetch-Bold",
      },
    ],
    sizes: {
      "1:1": {
        width: 1080,
        height: 1080,
      },
      "1.91:1": {
        width: 955,
        height: 500,
      },
    },
  },
});

export const GET = imagesWorker();
