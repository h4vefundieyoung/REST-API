import { randomBytes } from "crypto";
import { v4 }  from "uuid"

import { RequestHelper, randomize } from "../../helpers";
import { httpStatus } from "../../types/http";

const { OK, CREATED, NO_CONTENT, BAD_REQUEST, FORBIDDEN, NOT_FOUND } = httpStatus;

const { get, post, del, put, endpoints } = RequestHelper;
const { usersEndpoint: endpoint } = endpoints;
const userData = { login: "testuser", password: "testpassword" }
const body = JSON.stringify(userData);

describe("Users endpoint", () => {
  const MOCKED_USERS_AMOUNT = 5;

  beforeAll(async () => {
    const promises = [];
    for(let i = 0; i < MOCKED_USERS_AMOUNT; i++) {
      promises.push(post({ endpoint, body }));
    }
    await Promise.all(promises);
  });

  it("should get all users", async () => {
    const { data, res } = await get({ endpoint });
    expect(res.statusCode).toBe(OK);
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThanOrEqual(MOCKED_USERS_AMOUNT);
  });

  it("should create user", async () => {
    const { data } = await get({ endpoint });
    const { statusCode } = await post({ endpoint, body });
    const { data: _data } = await get({ endpoint });
    expect(statusCode).toBe(CREATED);
    expect(_data.length).toBeGreaterThan(data.length);
  })

  it("should get user by id", async () => {
    const { data } = await get({ endpoint });
    const user = data[data.length -1];
    const { res, data: _data } = await get({ endpoint, id: user.id });
    expect(res.statusCode).toBe(OK);
    expect(user).toMatchObject(_data);
  });

  it("should remove password from user dto", async () => {
    const { data } = await get({ endpoint });
    const user = data.at(-1) as any;
    expect(user.password).toBeUndefined();
  });

  it("should delete user", async () => {
    const { data: users } = await get({ endpoint });
    const { id } = users[0];
    const { statusCode } = await del({ endpoint, id });
    const { data } = await get({ endpoint });
    expect(statusCode).toBe(NO_CONTENT);
    expect(data.find(({ id: entityId }) => id === entityId)).toBeUndefined();
  });

  it("should send bad request status for wrong update password dto", async () => {
    const { id } = await randomize(((await get({ endpoint })).data));
    const { statusCode } = await put({ endpoint, id, body: JSON.stringify({}) });
    expect(statusCode).toBe(BAD_REQUEST);
  });

  it("should send bad request status for wrong create user dto", async () => {
    const { statusCode } = await post({ endpoint, body: JSON.stringify({}) });
    expect(statusCode).toBe(BAD_REQUEST);
  })

  it("should sent forbidden status code for wrong credentials", async () => {
    const { id } = randomize(((await get({ endpoint })).data));
    const wrongCredentials = { oldPassword: randomBytes(2).toString(), newPassword: randomBytes(2).toString() };
    const { statusCode } = await put({ endpoint, id, body: JSON.stringify(wrongCredentials)});
    expect(statusCode).toBe(FORBIDDEN);
  });

  it("should send not found status for wrong id delete request", async () => {
    const { statusCode: deleteStatus } = await del({ endpoint, id: v4() });
    expect(deleteStatus).toBe(NOT_FOUND);
  })

  it("should send not found status for wrong id update request", async () => {
    const updatePasswordDto = { oldPassword: "", newPassword: "" };
    const { statusCode } = await put({ endpoint, id: v4(), body: JSON.stringify(updatePasswordDto) });
    expect(statusCode).toBe(NOT_FOUND);
  })

  it("should send not found status for wrong id get request", async () => {
    const { res } = await get({ endpoint, id: v4() });
    expect(res.statusCode).toBe(NOT_FOUND);
  })
})