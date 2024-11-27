import { Row } from "./row";
import { Text } from "./text";

const BrianClankerBanner = () => {
  return (
    <Row tw="absolute bottom-0 right-0 text-white">
      <Text
        tw="text-[28px] mr-[140px] mb-[20px]"
        style={{ fontFamily: "ChakraPetch-Bold" }}
      >
        Brian Clanker 🤖
      </Text>
    </Row>
  );
};

export { BrianClankerBanner };
