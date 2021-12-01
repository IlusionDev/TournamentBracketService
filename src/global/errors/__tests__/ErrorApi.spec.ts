import ErrorApi from "@/global/errors/ErrorApi";

describe("ErrorApi", () => {
  it("creates a error api", () => {
    const errorApi = new ErrorApi("message", 500)

    expect(errorApi.statusCode).toEqual(500)
    expect(errorApi.message).toEqual("message")
  })
})
