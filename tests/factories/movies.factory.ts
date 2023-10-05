import { faker } from "@faker-js/faker";
import prisma from "../../src/database/index";

export async function insertMovie(rentalId?: number) {
    return prisma.movie.create({
        data: {
            name: faker.internet.domainName(),
            adultsOnly: faker.datatype.boolean(),
            rentalId: rentalId || null
        }
    })
}