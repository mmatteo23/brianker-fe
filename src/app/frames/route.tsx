/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { appURL } from "../utils";

const frameHandler = frames(async (ctx) => {
  const counter = ctx.message
    ? ctx.searchParams.op === "+"
      ? ctx.state.counter + 1
      : ctx.state.counter - 1
    : ctx.state.counter;

  return {
    image: (
      <div tw="flex flex-col">
        <div tw="flex">Brian Clanker will destroy the current Clanker</div>
      </div>
    ),
    buttons: [
      <Button action="post" target={{ pathname: "/", query: { op: "+" } }}>
        Increment
      </Button>,
      <Button action="post" target={{ pathname: "/", query: { op: "-" } }}>
        Decrement
      </Button>,
      <Button action="link" target={appURL()}>
        External
      </Button>,
      <Button action="post" target={{ pathname: "/token" }}>
        Token
      </Button>,
    ],
    state: { counter: counter },
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
