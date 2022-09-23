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
logging - "A is in input, but it's not in reference - therefore it's being dropped"
"D is in reference but not in input"

see test()

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
                console.warn("processorCountries: '" + r + "' is in reference but not in input data, so it will be missing.")
            }
        }
    })
    // to aid possible incosistencies, check the other way round as well
    for(const el in input) {
        if(!ref.includes(el)) {
            console.warn("processorCountries: '" + el + "' is in input data, but not in the reference. Therefore it's being dropped.")
        }
    }

    return [out, groupChanges]
}

// ccode : name  (ISO 3166-1 Alpha-2 codes (uppercase))
function _process(inputData, output) {

    // use Optional Chaining once available
    if(inputData && inputData.dimension && inputData.dimension.geo && inputData.dimension.geo.category && inputData.dimension.geo.category.label) {

        if(!output.categories) {
            output.categories = {}
        }

        if(output.countryOrder) {
            [output.categories.countries, output.groupChanges] = order(inputData.dimension.geo.category.label, output.countryOrder)
        } else {
            console.warn("processorCountries: country order is not defined. Oder of input data is taken and consequently, there will be no group change detection possible.")
            output.categories.countries = new Map()
            output.groupChanges = []
            for(const el in inputData.dimension.geo.category.label) {
                output.categories.countries.set(el, inputData.dimension.geo.category.label[el])
            }
        }

    } else {
        console.error("processorCountries: invalid input")
    }
}


export function process(inputData, output) {
    //test()
    _process(inputData, output)
}


function test() {
    let inputData = {}
    inputData["dimension"] = {}
    inputData["dimension"]["geo"] ={}
    inputData["dimension"]["geo"]["category"] = {}
    inputData["dimension"]["geo"]["category"]["label"] = {A:"A",B:"B",C:"C"}

    let output = {}
    output["codes"] = new Map()
    output.countryOrder = ["C","B","D"]  // ref

    _process(inputData, output)

    console.log(output)
}