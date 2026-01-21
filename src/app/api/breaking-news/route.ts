import { NextRequest, NextResponse } from "next/server";
import { getGqlClient } from "@/services/graphql-client";
import { Q_BREAKING_NEWS } from "@/services/article.gql";

export async function GET(request: NextRequest) {
  try {
    const client = getGqlClient(request.nextUrl.origin);
    const data = await client.request(Q_BREAKING_NEWS);

    return NextResponse.json({
      success: true,
      data: data.breakingNews,
    });
  } catch (error) {
    console.error("Error fetching breaking news:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch breaking news",
      },
      { status: 500 }
    );
  }
}
