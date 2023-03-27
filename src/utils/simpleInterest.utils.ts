/**
 * Function to calculate simple interest.
 * @param principle number
 * @param time number
 * @param rate number
 *
 * @return simpleInterest number
 */
export function calculateSimpleInterest(
    principle: number,
    time: number,
    rate: number
) {
    return (principle * time * rate) / 1000000;
}
