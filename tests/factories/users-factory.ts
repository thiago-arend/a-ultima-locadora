import { faker } from "@faker-js/faker";
import prisma from "../../src/database/index";

export async function insertUser() {
    return prisma.user.create({
        data: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            cpf: faker.internet.ipv4().replace(/\.$/g, ''),
            birthDate: faker.date.birthdate()
        }
    })
}

export async function mockUser() {
    return {
        id: faker.number.int(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        cpf: faker.internet.ipv4().replace(/\.$/g, ''),
        birthDate: faker.date.birthdate()
    }
}