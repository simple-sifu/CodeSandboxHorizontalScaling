import AddBooksPresenter from "./AddBooksPresenter";
import httpGateway from "../Shared/HttpGateway";
import Observable from "../Shared/Observable";
import booksRepository from "./BooksRepository";
import BookListPresenter from "./BookListPresenter";
import GetPublicBooksStub from "../TestTools/GetPublicBooksStub";

describe("add book", () => {
  it("should call api", async () => {
    // arrange
    jest.clearAllMocks();
    booksRepository.booksPm = new Observable([]);
    httpGateway.post = jest.fn();

    // act
    let addBooksPresenter = new AddBooksPresenter();
    addBooksPresenter.addBook("UFT", "Peter Heard");

    // assert
    expect(httpGateway.post).toBeCalledWith(
      "https://api.logicroom.co/api/pete@logicroom.co/books",
      { name: "UFT", author: "Peter Heard", ownerId: "pete@logicroom.co" }
    );
  });
  it("should load(anchor) and reload books", async () => {
    // arrange
    let viewModel = null;
    jest.clearAllMocks();
    booksRepository.booksPm = new Observable([]);
    httpGateway.get = jest.fn().mockImplementation((path) => {
      return GetPublicBooksStub();
    });
    let bookListPresenter = new BookListPresenter();

    // act
    await bookListPresenter.load((generatedViewModel) => {
      viewModel = generatedViewModel;
    });

    // assert anchor
    expect(httpGateway.get).toBeCalledWith(
      "https://api.logicroom.co/api/pete@logicroom.co/books"
    );
    expect(viewModel[0].name).toBe("Moby Dick");
    expect(viewModel[4].name).toBe("The Hobbit");
    expect(viewModel.length).toBe(5);

    // rearrange for reload(pivot)
    jest.clearAllMocks();
    viewModel = null;
    const pivotedBookStub = GetPublicBooksStub();
    pivotedBookStub.result.push(pivotedBookStub.result[2]);
    httpGateway.get = jest.fn().mockImplementation((path) => {
      return pivotedBookStub;
    });
    httpGateway.post = jest.fn();
    let addBooksPresenter = new AddBooksPresenter();
    bookListPresenter = new BookListPresenter();

    // act
    await addBooksPresenter.addBook("UFT", "Pete Heard");

    // assert with new book
    expect(viewModel[0].name).toBe("Moby Dick");
    expect(viewModel[4].name).toBe("The Hobbit");
    expect(viewModel[5].name).toBe("Wind in the willows");
    expect(viewModel.length).toBe(6);
  });
});
