const prisma = require('./client');


const populate = async() => {
    return await prisma.coordinates.createManyAndReturn ({
        data: [
            {
                name: "waldo",
                x0: 24.682901510070494,
                x1: 27.137554698917285,
                y0: 79.34730066321913,
                y1: 73.69274798762913
            },
            {
                name: "wenda",
                x0: 25.56930405048739,
                x1: 27.273924320519882,
                y0: 62.34099611747594,
                y1: 59.49378675913885
            },
            {
                name: "wizard",
                x0: 57.41161069469435,
                x1: 58.843491721521644,
                y0: 79.23233823536594,
                y1: 76.92379010698453
            },
            {
                name: "odlaw",
                x0: 47.38844350690329,
                x1: 49.502172641743584,
                y0: 97.08881616644993,
                y1: 94.72927538867512
            }
        ]
    })
}

// populate();


exports.getCharacterCoordinates = async(character) => {
    return await prisma.coordinates.findUnique({
        where: {
            name: character
        }
    })
}

exports.addScore = async(name, time) => {
    return await prisma.score.create({
        data: {
            name,
            time
        }
    })
}

exports.getTop10 = async() => {
    return await prisma.score.findMany({
        take: 10,
        omit: {
            id: true
        },
        orderBy: {
            time: 'asc'
        }
    })
}