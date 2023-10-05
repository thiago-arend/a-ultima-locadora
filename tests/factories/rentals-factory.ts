import { faker } from "@faker-js/faker";
import prisma from "../../src/database/index";

export async function insertRental(userId: number) {
    return prisma.rental.create({
        data: {
            date: faker.date.anytime(),
            endDate: faker.date.anytime(),
            userId,
            closed: faker.datatype.boolean()
        }
    })
}