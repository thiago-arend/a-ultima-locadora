import rentalsRepository from "repositories/rentals-repository";
import { mockUser } from "../factories/users-factory"

describe("Rentals Service Unit Tests", () => {

  it("should return pendentRentalError if user already has a rental", () => {
    const user = mockUser();

    jest.spyOn(rentalsRepository, "getRentalsByUserId").mockImplementationOnce((): any => {
      return user
    });
  })

})