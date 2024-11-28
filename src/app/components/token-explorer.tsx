import { TokenDataTable } from "@/app/components/token-table";
import { columns as tokenColumns } from "@/app/components/token-table";
import { getTokens } from "@/utils/db";

const DEFAULT_TOKEN_SIZE = 10;

export async function TokenExplorer() {
  const tokens = await getTokens(DEFAULT_TOKEN_SIZE);

  const tokensWithMarketData = tokens.map((token) => {
    return {
      ...token,
      marketCap: 100000000,
      price: 89.76,
    };
  });

  return (
    <div className="w-full flex flex-col">
      <TokenDataTable
        columns={tokenColumns}
        data={tokensWithMarketData}
        defaultPageSize={DEFAULT_TOKEN_SIZE}
      />
    </div>
  );
}
