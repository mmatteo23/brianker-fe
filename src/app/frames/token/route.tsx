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
import { BackgroundImage } from "../components/background-image";

const frameHandler = frames(async (ctx) => {
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
            {/* <Text tw="text-[80px] mb-8 mx-auto">Copy Trade on Interface</Text> */}
            <img
              src={`${appURL()}/images/copy.png`}
              tw="w-[760px] h-[760px] rounded-xl mx-auto"
            />
            <Row tw="mt-8 justify-between w-[760px] mx-auto">
              <Column tw="">
                <Text
                  tw="text-3xl mb-4"
                  style={{
                    fontFamily: "ChakraPetch-Regular",
                  }}
                >
                  Copy Trade on Interface
                </Text>
                <Text
                  tw="text-5xl h-[60px] items-center"
                  style={{
                    fontFamily: "ChakraPetch-Bold",
                  }}
                >
                  $copy
                </Text>
              </Column>
              <Column>
                <Text
                  tw="text-3xl mb-4"
                  style={{
                    fontFamily: "ChakraPetch-Regular",
                  }}
                >
                  Requested by
                </Text>
                <UserBanner
                  user={{
                    displayName: "itsmide.eth",
                    pfp: "https://avatars.githubusercontent.com/u/75645114?v=4",
                  }}
                  size="sm"
                  tw="text-5xl"
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
      <Button action="link" target={{ pathname: `${appURL()}/token` }}>
        View
      </Button>,
      <Button
        action="link"
        target={{
          pathname:
            "https://dexscreener.com/base/0xc1a6fbedae68e1472dbb91fe29b51f7a0bd44f97",
        }}
      >
        DexScreener
      </Button>,
      <Button action="link" target={{ pathname: "/token" }}>
        Buy
      </Button>,
    ],
    imageOptions: {
      aspectRatio: "1:1",
    },
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
