export default function numberWithCommas(x): string {
    console.log("numberWithCommas: ", x)
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}