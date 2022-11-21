import booksRepository from "../Books/BooksRepository";
import httpGateway from "../Shared/HttpGateway";
import BookListPresenter from "../Books/BookListPresenter";
import AddBooksPresenter from "../Books/AddBooksPresenter";
import GetPublicBooksStub from "../TestTools/GetPublicBooksStub";
import Observable from "../Shared/Observable";

export default class BookAdderTestHarness {
  async init(callback) {
    jest.clearAllMocks();
    booksRepository.booksPm = new Observable([]);
    httpGateway.get = jest.fn().mockImplementation((path) => {
      return GetPublicBooksStub();
    });
    let bookListPresenter = new BookListPresenter();

    // act
    await bookListPresenter.load(callback);
  }

  async addBook() {
    jest.clearAllMocks();
    const pivotedBookStub = GetPublicBooksStub();
    pivotedBookStub.result.push(pivotedBookStub.result[2]);
    httpGateway.get = jest.fn().mockImplementation((path) => {
      return pivotedBookStub;
    });
    httpGateway.post = jest.fn();
    let addBooksPresenter = new AddBooksPresenter();

    // act
    await addBooksPresenter.addBook("UFT", "Pete Heard");
  }
}
