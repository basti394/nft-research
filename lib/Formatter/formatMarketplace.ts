
export default function formatMarketplace(input: string): string {

    if (input == "magiceden_v2") return "Magic Eden V2"
    if (input == "fractal") return "Fractal"
    if (input == "magiceden") return "Magic Eden"
    if (input == "coralcube") return "Coral Cube"
    if (input == "coralcube_v2") return "Coral Cube V2"
    if (input == "solsea") return "SolSea"
    if (input == "solanart") return "Solanart"
    if (input == "solanart_ah") return "Solanart"

    else return input
}
