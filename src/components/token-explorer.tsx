import {
  TokenDataTable,
  columns as tokenColumns,
} from "@/components/token-table";
import { getTokens } from "@/utils/db";

const DEFAULT_TOKEN_SIZE = 10;

export async function TokenExplorer() {
  const tokens = await getTokens(DEFAULT_TOKEN_SIZE);

  return (
    <div className="w-full flex flex-col">
      <TokenDataTable
        columns={tokenColumns}
        data={tokens}
        defaultPageSize={DEFAULT_TOKEN_SIZE}
      />
    </div>
  );
}
