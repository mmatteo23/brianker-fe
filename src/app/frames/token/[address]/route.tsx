/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { frames } from "@/app/frames/frames";
import { appURL } from "@/app/utils";
import { Button } from "frames.js/next";
import { Container } from "@/app/frames/components/container";
import { Column } from "@/app/frames/components/column";
import { Text } from "@/app/frames/components/text";
import { Row } from "@/app/frames/components/row";
import { UserBanner } from "@/app/frames/components/user-banner";
import { BrianClankerBanner } from "@/app/frames/components/brian-clanker-banner";
import { BackgroundImage } from "@/app/frames/components/background-image";
import { getTokenFromAddress } from "@/utils/db";

import { getAddress, isAddress } from "viem";
import { getUserDataForFid } from "frames.js";

function truncate(text: string, max: number) {
  return text.slice(0, max - 1) + (text.length > max ? "..." : "");
}

const frameHandler = frames(async (ctx) => {
  const address = ctx.url.pathname.split("/").pop();
  try {
    if (!address) {
      throw new Error("No address provided");
    }
    if (!isAddress(address, { strict: false })) {
      throw new Error("Invalid address");
    }
    const token = await getTokenFromAddress(getAddress(address));
    if (!token) {
      throw new Error("Token not found");
    }
    const requestor = await getUserDataForFid({ fid: token.requestedBy });
    return {
      image: (
        <BackgroundImage
          src={`${appURL()}/images/square_desert_painted.png`}
          width="1080px"
          height="1080px"
          container="absolute"
        >
          <Container>
            <Column tw="my-auto mx-auto bg-black/75 text-white rounded-xl w-[800px] py-[20px]">
              <img
                src={token.image || `${appURL()}/images/copy.png`}
                tw="w-[760px] h-[760px] rounded-xl mx-auto"
                alt={`Token ${token.name} logo`}
                style={{
                  objectFit: "contain",
                }}
              />
              <Row tw="mt-8 justify-between w-[760px] mx-auto">
                <Column tw="">
                  <Text
                    tw="text-3xl mb-4"
                    style={{
                      fontFamily: "ChakraPetch-Regular",
                    }}
                  >
                    {truncate(token.name, 25)}
                  </Text>
                  <Text
                    tw="text-4xl h-[60px] items-center"
                    style={{
                      fontFamily: "ChakraPetch-Bold",
                    }}
                  >
                    {truncate(token.ticker, 15)}
                  </Text>
                </Column>
                <Column tw="w-[350px] flex items-end">
                  <Text
                    tw="text-3xl mb-4"
                    style={{
                      fontFamily: "ChakraPetch-Regular",
                    }}
                  >
                    {token ? "Requested by" : "Who dis?"}
                  </Text>
                  <UserBanner
                    user={{
                      displayName: truncate(
                        `@${requestor?.username}` ||
                          token.requestedBy.toString(),
                        15
                      ),
                      pfp: requestor?.profileImage || "",
                    }}
                    size="sm"
                    tw="text-4xl"
                    style={{
                      fontFamily: "ChakraPetch-Bold",
                    }}
                  />
                </Column>
              </Row>
            </Column>
          </Container>
          <BrianClankerBanner />
        </BackgroundImage>
      ),
      buttons: [
        <Button action="link" target={`${appURL()}/token/${address}`}>
          View
        </Button>,
        <Button
          action="link"
          target={`https://dexscreener.com/base/${address}`}
        >
          DexScreener
        </Button>,
        <Button action="link" target={`${appURL()}/token/${address}`}>
          Buy
        </Button>,
      ],
      imageOptions: {
        aspectRatio: "1:1",
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      image: (
        <BackgroundImage
          src={`${appURL()}/images/square_desert_painted.png`}
          width="1080px"
          height="1080px"
          container="absolute"
        >
          <Container>
            <Column tw="my-auto mx-auto bg-black/75 text-white rounded-xl w-[800px] py-[20px]">
              <img
                src={`${appURL()}/images/copy.png`}
                tw="w-[760px] h-[760px] rounded-xl mx-auto"
                alt={`Token not found logo`}
                style={{
                  objectFit: "contain",
                }}
              />
              <Row tw="mt-8 justify-between w-[760px] mx-auto">
                <Column tw="">
                  <Text
                    tw="text-3xl mb-4"
                    style={{
                      fontFamily: "ChakraPetch-Regular",
                    }}
                  >
                    An error occured
                  </Text>
                  <Text
                    tw="text-4xl h-[60px] items-center"
                    style={{
                      fontFamily: "ChakraPetch-Bold",
                    }}
                  >
                    {errorMessage}
                  </Text>
                </Column>
                <Column>
                  <Text
                    tw="text-3xl mb-4"
                    style={{
                      fontFamily: "ChakraPetch-Regular",
                    }}
                  >
                    {"1) What"}
                  </Text>
                  <UserBanner
                    user={{
                      displayName: "Brian Clanker",
                      pfp: `${appURL()}/images/default-pfp.png`,
                    }}
                    size="sm"
                    tw="text-4xl"
                    style={{
                      fontFamily: "ChakraPetch-Bold",
                    }}
                  />
                </Column>
              </Row>
            </Column>
          </Container>
          <BrianClankerBanner />
        </BackgroundImage>
      ),
      buttons: [
        <Button action="link" target={`${appURL()}/token/${address}`}>
          View
        </Button>,
        <Button
          action="link"
          target={`https://dexscreener.com/base/${address}`}
        >
          DexScreener
        </Button>,
        <Button action="link" target={`${appURL()}/token/${address}`}>
          Buy
        </Button>,
      ],
      imageOptions: {
        aspectRatio: "1:1",
      },
    };
  }
});

export const GET = frameHandler;
export const POST = frameHandler;
