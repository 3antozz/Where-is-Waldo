const prisma = require('./client');


const populate = async() => {
    return await prisma.coordinates.createManyAndReturn ({
        data: [
            {
                name: "waldo",
                x0: 42.41095231840842,
                x1: 44.11557258844091,
                y0: 79.71909081782127,
                y1: 73.7377654277232
            },
            {
                name: "wenda",
                x0: 43.22917004802402,
                x1: 43.97920296683831,
                y0: 60.9318489010952,
                y1: 59.185466042366016
            },
            {
                name: "wizard",
                x0: 65.25286393684382,
                x1: 66.07108166645942,
                y0: 79.25755703402838,
                y1: 76.84879918254258
            },
            {
                name: "odlaw",
                x0: 57.95708918110475,
                x1: 59.457155018733346,
                y0: 97.10576983978319,
                y1: 94.82336936380898
            }
        ]
    })
}


exports.getCharacterCoordinates = async(character) => {
    return await prisma.coordinates.findUnique({
        where: {
            name: character
        }
    })
}