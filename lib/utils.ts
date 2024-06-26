export function addCommas(X:number): string
{
    return X.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}