import AddBooksPresenter from "./AddBooksPresenter";
import httpGateway from "../Shared/HttpGateway";
import Observable from "../Shared/Observable";
import booksRepository from "./BooksRepository";

describe("add book", () => {
  it.only("should call api", async () => {
    jest.clearAllMocks();
    booksRepository.booksPm = new Observable([]);
    httpGateway.post = jest.fn();
    let addBooksPresenter = new AddBooksPresenter();
    addBooksPresenter.addBook("UFT", "Peter Heard");
    console.log(httpGateway.post.mock.calls);
    expect(httpGateway.post).toBeCalledWith(
      "https://api.logicroom.co/api/pete@logicroom.co/books",
      { name: "UFT", author: "Peter Heard", ownerId: "pete@logicroom.co" }
    );
  });
  it("should load and reload books", async () => {});
});
