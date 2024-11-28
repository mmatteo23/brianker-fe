import { TokenDetails } from "@/app/components/token-details";

export default async function TokenPage() {
  return (
    <div className="p-4 bg-slate-200 rounded-xl w-full">
      <TokenDetails />
    </div>
  );
}
