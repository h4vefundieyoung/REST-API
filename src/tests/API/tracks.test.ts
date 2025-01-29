import { randomBytes } from "crypto";
import { v4 } from "uuid";

import { RequestHelper, randomize } from "../../helpers";
import { httpStatus } from "../../types/http";

const { OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND } = httpStatus;

const trackData = { albumId: null, artistId: null, duration: 100, name: "mockedtrack" };
const body = JSON.stringify(trackData);

const { get, post, put, del, endpoints } = RequestHelper;
const { tracksEndpoint: endpoint, favoritesTracksEndpoint, favoritesEndpoint } = endpoints;

describe("Tracks tracksEndpoint", () => {
  const MOCKED_TRACKS_AMOUNT = 5;

  beforeAll(async () => {
    const promises = [];
    for(let i = 0; i < MOCKED_TRACKS_AMOUNT; i++) {
      promises.push(post({ endpoint, body }));
    }
    await Promise.all(promises);
  });

  it("should get all tracks", async () => {
    const { data, res } = await get({ endpoint });
    expect(res.statusCode).toBe(OK);
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThanOrEqual(MOCKED_TRACKS_AMOUNT);
  });

  it("should create track", async () => {
    const { data } = await get({ endpoint })
    const { statusCode } = await post({ endpoint, body });
    const { data: _data } = await get({ endpoint })
    expect(statusCode).toBe(CREATED);
    expect(_data.length).toBeGreaterThan(data.length);
  })

  it("should get track by id", async () => {
    const { data } = await get({ endpoint });
    const track = data[data.length -1];
    const { res, data: _data } = await get({ endpoint, id: track.id });
    expect(res.statusCode).toBe(OK);
    expect(track).toMatchObject(_data);
  });

  it("should update track", async () => {
    const track = randomize(((await get({ endpoint })).data));
    const updatedName = randomBytes(2).toString();
    track.name = updatedName;
    const { statusCode } = await put({ endpoint, id: track.id, body: JSON.stringify(track) });
    expect(statusCode).toBe(OK);
  });

  it("should delete track", async () => {
    const { id: idToRemove } = await randomize(((await get({ endpoint })).data));
    const { statusCode } = await del({ endpoint, id: idToRemove });
    const { data } = await get({ endpoint });
    expect(statusCode).toBe(NO_CONTENT);
    expect(data.find(({ id }) => id === idToRemove)).toBeUndefined();
  });

  it("should send bad request status for wrong update track dto", async () => {
    const { id } = await randomize(((await get({ endpoint })).data));
    const { statusCode } = await put({ endpoint, id, body: JSON.stringify({}) });
    expect(statusCode).toBe(BAD_REQUEST);
  });

  it("should send bad request status for wrong create track dto", async () => {
    const { statusCode } = await post({ endpoint, body: JSON.stringify({}) });
    expect(statusCode).toBe(BAD_REQUEST);
  })

  it("should send not found status for wrong id delete request", async () => {
    const { statusCode: deleteStatus } = await del({ endpoint, id: v4() });
    expect(deleteStatus).toBe(NOT_FOUND);
  })

  it("should send not found status for wrong id update request", async () => {
    const { statusCode } = await put({ endpoint, id: v4(), body });
    expect(statusCode).toBe(NOT_FOUND);
  })

  it("should send not found status for wrong id get request", async () => {
    const { res } = await get({ endpoint, id: v4() });
    expect(res.statusCode).toBe(NOT_FOUND);
  })

  it("should remove tracks from favorites when deleted", async () => {
    const { id } = await randomize(((await get({ endpoint })).data));
    await post({ endpoint: favoritesTracksEndpoint, id });
    await del({ endpoint, id });
    const { data } = await get({ endpoint: favoritesEndpoint });
    expect(data.tracks.find(({ id: entityId }) => id === entityId)).toBeUndefined();
  });
});
