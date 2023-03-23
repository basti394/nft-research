export default function generateWeekList(from: Date, to: Date): Date[] {
    const weekList: Date[] = [];

    // Berechne den Zeitunterschied zwischen dem gegebenen Datum und heute in Millisekunden
    const timeDiff = to.getTime() - from.getTime();

    // Konvertiere den Zeitunterschied in Tage und runde ihn auf die nächste ganze Zahl
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Wenn der Zeitunterschied kleiner als 7 Tage ist, gibt es keine Woche, die verstrichen ist
    if (daysDiff < 7) {
        return weekList;
    }

    // Berechne die Anzahl der Wochen, die seit dem gegebenen Datum vergangen sind
    const weeksDiff = Math.floor(daysDiff / 7);

    // Generiere eine Liste von Tagen, an denen genau eine Woche vergangen ist
    for (let i = 1; i <= weeksDiff; i++) {
        const weekDate = new Date(from.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
        weekList.push(weekDate);
    }

    return weekList;
}