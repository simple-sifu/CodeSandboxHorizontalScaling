import httpGateway from "../Shared/HttpGateway";
import BookAdderTestHarness from "../TestTools/BookAdderTestHarness";

describe("add book", () => {
  it("should call api", async () => {
    let bookAdderTestHarness = new BookAdderTestHarness();
    await bookAdderTestHarness.init(() => {});
    await bookAdderTestHarness.addBook();

    // assert
    expect(httpGateway.post).toBeCalledWith(
      "https://api.logicroom.co/api/pete@logicroom.co/books",
      { name: "UFT", author: "Pete Heard", ownerId: "pete@logicroom.co" }
    );
  });
  it("should load(anchor) and reload books", async () => {
    // setup
    let viewModel = null;
    let bookAdderTestHarness = new BookAdderTestHarness();
    await bookAdderTestHarness.init((generatedViewModel) => {
      viewModel = generatedViewModel;
    });

    // anchor
    expect(httpGateway.get).toBeCalledWith(
      "https://api.logicroom.co/api/pete@logicroom.co/books"
    );
    expect(viewModel[0].name).toBe("Moby Dick");
    expect(viewModel[4].name).toBe("The Hobbit");
    expect(viewModel.length).toBe(5);

    // reload(pivot)
    await bookAdderTestHarness.addBook();

    expect(httpGateway.get).toBeCalledWith(
      "https://api.logicroom.co/api/pete@logicroom.co/books"
    );
    // assert with new book
    expect(viewModel[0].name).toBe("Moby Dick");
    expect(viewModel[4].name).toBe("The Hobbit");
    expect(viewModel[5].name).toBe("Wind in the willows");
    expect(viewModel.length).toBe(6);
  });
});
