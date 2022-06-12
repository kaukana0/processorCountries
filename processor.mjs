/*
this 
1) extracts and orders the countries,
2) extracts the info after which countries there's a "change of group".
   for instance, this can serve as a hint for a dropdown box to insert separators


ordering:

given:
in  = ABC
ref = CBD

expected:
out=CB
logging - "A from input dropped, it's not in reference"
"D from reference missing in input"
*/

function order(input, ref) {
    let out = new Map()         // ordered by insertion
    let groupChanges = []
    let lastElementKey

    ref.forEach(r => {
        if(input.hasOwnProperty(r)) {
            out.set(r, input[r])
            lastElementKey = r
        } else {
            if(r === "-") {
                if(lastElementKey) {
                    groupChanges.push(lastElementKey)
                }
            } else {
                console.warn("countryProcessor: '" + r + "' from input data dropped, because missing in reference")
            }
        }
    })
    // to aid possible incosistencies, check the other way round as well
    for(const el in input) {
        if(!ref.includes(el)) {
            console.warn("countryProcessor: '" + el + "' from reference is missing in input data")
        }
    }

    return [out, groupChanges]
}

// ccode : name  (ISO 3166-1 Alpha-2 codes (uppercase))
export function process(inputData, output) {
    [output.countries, output.groupChanges] = order(inputData.dimension.geo.category.label, output.countryOrder)
}
