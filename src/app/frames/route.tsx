/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { appURL } from "../utils";

const frameHandler = frames(async (ctx) => {
  return {
    image: (
      <div tw="flex flex-col">
        <div tw="flex">Brian Clanker will destroy the current Clanker</div>
      </div>
    ),
    buttons: [
      <Button action="link" target={appURL()}>
        External
      </Button>,
      <Button action="post" target={{ pathname: "/token" }}>
        Token
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
