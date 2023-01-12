const request = require("supertest");
const cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;

function extractCsrfToken(res) {
    var $ = cheerio.load(res.text);
    return $("[name=_csrf]").val();
}

const login = async (agent, username, password) => {
    let res = await agent.get("/login");
    let csrfToken = extractCsrfToken(res);
    res = await agent.post("/session").send({
        email: username,
        password: password,
        _csrf: csrfToken,
    });
}; 

describe("Online Voting Platform Application", function () {
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
        server = app.listen(4040, () => { });
        agent = request.agent(server);
    });

afterAll(async () => {
    try {
        await db.sequelize.close();
        await server.close();
    } catch (error) {
        console.log(error);
    }
});

test("signup", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/admin").send({
        firstName: "satya",
        lastName: "burri",
        email: "burrisatya2003@gmail.com",
        password: "18182-EE-008",
        _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(500);
})
});

