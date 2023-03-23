export default function getCurrency(chain: string): string {
    if (chain == "eth") return "ETH"
    return "SOL"
}