describe("Helpers.js tests", function() {
    it("should parse valid JWT", function() {
        const actual = TkHelper.parseJwt("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUSyIsImlhdCI6MTY4NjU1NzIzNSwiZXhwIjoxNzE4MDkzMjM1LCJhdWQiOiJ3d3cuZXhhbXBsZS5jb20iLCJzdWIiOiJzdWJqZWN0IiwiUm9sZSI6ImRldmVsb3BlciJ9.sSRrYkiA1-fpYq0SkHdOV7ktckTZWA0-r5rkBWz8tss");
        expect(actual).toEqual({
            iss: "TK",
            iat: 1686557235,
            exp: 1718093235,
            aud: "www.example.com",
            sub: "subject",
            Role: "developer"
        });
    });
  });
