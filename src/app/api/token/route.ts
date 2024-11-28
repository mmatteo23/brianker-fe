import { getTokenFromAddress } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);

    const tokenAddress = searchParams.get("address");

    if (!tokenAddress) {
      return NextResponse.json(
        {
          status: "nok",
          error: {
            message: "Address missing",
          },
        },
        {
          status: 400,
          statusText: "Bad Request",
        }
      );
    }

    const token = await getTokenFromAddress(tokenAddress);
    if (!token) {
      return NextResponse.json(
        {
          status: "nok",
          error: {
            message: "Token not found",
          },
        },
        {
          status: 404,
          statusText: "Not Found",
        }
      );
    }
    return NextResponse.json({
      status: "ok",
      data: token,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "nok",
        error: {
          message: "Internal Server Error",
        },
      },
      {
        status: 500,
        statusText: "Internal Server Error",
      }
    );
  }
};
