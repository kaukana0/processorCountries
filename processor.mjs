export function process(inputData, output) {
    // ccode : name  (ISO 3166-1 Alpha-2 codes (uppercase))
    output.countries = inputData.dimension.geo.category.label
}
