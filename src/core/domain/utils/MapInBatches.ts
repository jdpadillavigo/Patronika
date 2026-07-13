export default async function mapInBatches<T, R>(
    items: T[],
    map: (item: T) => Promise<R>,
): Promise<R[]> {
    const results: R[] = [];
    const batchSize = 4;
    for (let start = 0; start < items.length; start += batchSize) {
        const batch = await Promise.all(items.slice(start, start + batchSize).map(map));
        results.push(...batch);
    }
    return results;
}
