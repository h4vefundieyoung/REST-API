import { randomBytes } from "crypto";
import { v4 } from "uuid";

import { RequestHelper, randomize } from "../../helpers";
import { httpStatus } from "../../types/http";

const { OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND } = httpStatus;
const { get, post, put, del, endpoints } = RequestHelper;
const { albumsEndpoint: endpoint, favoritesAlbumsEndpoint, favoritesEndpoint, tracksEndpoint } = endpoints;

const albumData = { year: 2004, artistId: null, name: "mockedalbum" };
const body = JSON.stringify(albumData);


describe("Albums endpoint", () => {
  const MOCKED_ALBUMS_AMOUNT = 5;

  beforeAll(async () => {
    const promises = [];
    for(let i = 0; i < MOCKED_ALBUMS_AMOUNT; i++) {
      promises.push(post({ endpoint, body }));
    }
    await Promise.all(promises);
  });

  it("should get all tracks", async () => {
    const { data, res } = await get({ endpoint });
    expect(res.statusCode).toBe(OK);
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThanOrEqual(MOCKED_ALBUMS_AMOUNT);
  });

  it("should create album", async () => {
    const { data } = await get({ endpoint });
    const { statusCode } = await post({ endpoint, body });
    const { data: _data } = await get({ endpoint });
    expect(statusCode).toBe(CREATED);
    expect(_data.length).toBeGreaterThan(data.length);
  })

  it("should get album by id", async () => {
    const { data } = await get({ endpoint });
    const album = data[data.length -1];
    const { res, data: _data } = await get({ endpoint, id: album.id });
    expect(res.statusCode).toBe(OK);
    expect(album).toMatchObject(_data);
  });

  it("should update album", async () => {
    const album = await randomize((await get({ endpoint })).data);
    const updatedName = randomBytes(4).toString();
    album.name = updatedName;
    const { statusCode } = await put({ endpoint, id: album.id, body: JSON.stringify(album)});
    expect(statusCode).toBe(OK);
  });

  it("should delete album", async () => {
    const { id: idToRemove } = await randomize((await get({ endpoint })).data);
    const { statusCode } = await del({ endpoint, id: idToRemove })
    const { data } = await get({ endpoint })
    expect(statusCode).toBe(NO_CONTENT);
    expect(data.find(({ id }) => id === idToRemove)).toBeUndefined();
  });

  it("should send bad request status for wrong update album dto", async () => {
    const { id } = await randomize((await get({ endpoint })).data);
    const { statusCode } = await put({ endpoint, id, body: JSON.stringify({}) });
    expect(statusCode).toBe(BAD_REQUEST);
  });

  it("should send bad request status for wrong create album dto", async () => {
    const { statusCode } = await post({ endpoint, body: JSON.stringify({}) });
    expect(statusCode).toBe(BAD_REQUEST);
  });

  it("should send not found status for wrong id delete request", async () => {
    const { statusCode: deleteStatus } = await del({ endpoint, id: v4() });
    expect(deleteStatus).toBe(NOT_FOUND);
  })

  it("should send not found status for wrong id update request", async () => {
    const { statusCode } = await put({ endpoint, id: v4(), body });
    expect(statusCode).toBe(NOT_FOUND);
  })

  it("should send not found status for wrong id get request", async () => {
    const { res } = await get({ endpoint, id: v4() })
    expect(res.statusCode).toBe(NOT_FOUND);
  })

  it("should remove album from favorites when deleted", async () => {
    const { id } = await randomize(((await get({ endpoint })).data));
    await post({ endpoint: favoritesAlbumsEndpoint, id });
    await del({ endpoint, id });
    const { data } = await get({ endpoint: favoritesEndpoint });
    expect(data.tracks.find(({ id: entityId }) => id === entityId)).toBeUndefined();
  });

  it("should remove album links from all tracks entities when deleted", async () => {
    const { id } = await randomize(((await get({ endpoint })).data));
    const body = { albumId: id, artistId: null, duration: 33, name: "whocares" };
    await post({ endpoint: tracksEndpoint, body: JSON.stringify(body) });
    await del({ endpoint, id });
    const { data } = await get({ endpoint: tracksEndpoint });
    expect(data.find(({ albumId }) => id === albumId)).toBeUndefined();
  });
});