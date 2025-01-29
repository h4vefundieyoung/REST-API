import { IncomingMessage } from "http";
import { v4 } from "uuid";

import { RequestHelper } from "../../helpers/requestHelper";
import { httpStatus } from "../../types/http";


const { OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND, UNPROCESSABLE_ENTITY } = httpStatus;
const { get, post, put, del, endpoints } = RequestHelper;
const { favoritesAlbumsEndpoint, favoritesArtistsEndpoint, favoritesEndpoint, favoritesTracksEndpoint, tracksEndpoint, albumsEndpoint, artistsEndpoint } = endpoints;


describe("favorites endpoint", () => {
  const MOCKED_FAVORITES_AMOUNT = 5;

  beforeAll(async () => {
    const createEntityRequests: Promise<IncomingMessage>[] = [];

    for(let i = 0; i < MOCKED_FAVORITES_AMOUNT; i++) {
      const entities = [ 
        { 
          data: { artistId: null, year: i, name: i }, 
          endpoint: albumsEndpoint
        }, 
        {
          data: { grammy: false, name: i },
          endpoint: artistsEndpoint
        },
        {
          data: { artistId: null, albumId: null, name: i, duration: i },
          endpoint: tracksEndpoint
        }
      ];
      entities.forEach(({ data, endpoint }) => createEntityRequests.push(post({ endpoint, body: JSON.stringify(data) })));
    }

    await Promise.all(createEntityRequests);
    const tracks = (await get({ endpoint: tracksEndpoint })).data.map(({ id }) => ({ endpoint: favoritesTracksEndpoint, id }));
    const albums = (await get({ endpoint: albumsEndpoint })).data.map(({ id }) => ({ endpoint: favoritesAlbumsEndpoint, id }))
    const artists = (await get({ endpoint: artistsEndpoint })).data.map(({ id }) => ({ endpoint: favoritesArtistsEndpoint, id }))
    
    const data = [...tracks, ...albums, ...artists];
    const addFavRequests = [];
    for(let i = 0; i < data.length; i++) {
      const { endpoint, id } = data[i];
      addFavRequests.push(post({ endpoint, id }));
    }
    await Promise.all(addFavRequests);
  });

  it("should resolve entities", async () => {
    const { res, data } = await get({ endpoint: favoritesEndpoint });
    expect(res.statusCode).toBe(OK);
    expect(data.albums.at(0)).toBeInstanceOf(Object);
    expect(data.artists.at(0)).toBeInstanceOf(Object);
    expect(data.tracks.at(0)).toBeInstanceOf(Object);
  });

  it("should add favorite track", async () => {
    const trackData = { artistId: null, albumId: null, name: "favoriteTrack", duration: Math.random() };
    await post({ endpoint: tracksEndpoint, body: JSON.stringify(trackData) });
    const { data } = await get({ endpoint: tracksEndpoint });
    const { statusCode } = await post({ endpoint: favoritesTracksEndpoint, id: data.at(-1)!.id });
    expect(statusCode).toBe(CREATED);
  });

  it("should add favorite artist", async () => {
    const artistData = { grammy: false, name: "favoriteArtist" };
    await post({ endpoint: artistsEndpoint, body: JSON.stringify(artistData) });
    const { data } = await get({ endpoint: artistsEndpoint });
    const { statusCode } = await post({ endpoint: favoritesArtistsEndpoint, id: data.at(0)!.id });
    expect(statusCode).toBe(CREATED);
  });

  it("should add favorite album", async () => {
    const albumData = { artistId: null, year: 1111, name: "favoriteAlbum" };
    await post({ endpoint: albumsEndpoint, body: JSON.stringify(albumData) });
    const { data } = await get({ endpoint: albumsEndpoint });
    const { statusCode } = await post({ endpoint: favoritesAlbumsEndpoint, id: data.at(0)!.id });
    expect(statusCode).toBe(CREATED);
  });

  it("should remove favorite track", async () => {
    const { data } = await get({ endpoint: favoritesEndpoint });
    const { id } = data.tracks.at(0);
    const { statusCode } = await del({ endpoint: favoritesTracksEndpoint, id });
    expect(statusCode).toBe(NO_CONTENT);
  });

  it("should remove favorite artist", async () => {
    const { data } = await get({ endpoint: favoritesEndpoint });
    const { id } = data.artists.at(0);
    const { statusCode } = await del({ endpoint: favoritesArtistsEndpoint, id });
    expect(statusCode).toBe(NO_CONTENT);
  });

  it("should remove favorite album", async () => {
    const { data } = await get({ endpoint: favoritesEndpoint });
    const { id } = data.albums.at(0);
    const { statusCode } = await del({ endpoint: favoritesAlbumsEndpoint, id });
    expect(statusCode).toBe(NO_CONTENT);
  });


  it("should return unprocessed entity status when trying to add wrong album uuid", async () => {
    const { statusCode } = await post({ endpoint: favoritesAlbumsEndpoint, id: v4() });
    expect(statusCode).toBe(UNPROCESSABLE_ENTITY);
  });

  it("should return unprocessed entity status when trying to add wrong artist uuid", async () => {
    const { statusCode } = await post({ endpoint: favoritesArtistsEndpoint, id: v4() });
    expect(statusCode).toBe(UNPROCESSABLE_ENTITY);
  })

  it("should return bad request status when trying to add wrong track uuid", async () => {
    const { statusCode } = await post({ endpoint: favoritesTracksEndpoint, id: v4() });
    expect(statusCode).toBe(UNPROCESSABLE_ENTITY);
  })

  it("should return not found status when trying to remove unexisting album uuid", async () => {
    const { statusCode } = await del({ endpoint: favoritesAlbumsEndpoint, id: v4() });
    expect(statusCode).toBe(NOT_FOUND);
  })

  it("should return unprocessed entity status when trying to remove unexisting track uuid", async () => {
    const { statusCode } = await del({ endpoint: favoritesTracksEndpoint, id: v4() });
    expect(statusCode).toBe(NOT_FOUND);
  })

  it("should return unprocessed entity status when trying to remove unexisting artist uuid", async () => {
    const { statusCode } = await del({ endpoint: favoritesArtistsEndpoint, id: v4() });
    expect(statusCode).toBe(NOT_FOUND);
  })

  it("should return bad request status when trying to remove wrong album uuid", async () => {
    const { statusCode } = await del({ endpoint: favoritesAlbumsEndpoint, id: "wronguuid" });
    expect(statusCode).toBe(BAD_REQUEST);
  })

  it("should return unprocessed entity status when trying to remove wrong track uuid", async () => {
    const { statusCode } = await del({ endpoint: favoritesTracksEndpoint, id: "wronguuid" });
    expect(statusCode).toBe(BAD_REQUEST);
  })

  it("should return unprocessed entity status when trying to remove wrong artist uuid", async () => {
    const { statusCode } = await del({ endpoint: favoritesArtistsEndpoint, id: "wronguuid" });
    expect(statusCode).toBe(BAD_REQUEST);
  })

  it("should return bad request status when trying to add wrong album uuid", async () => {
    const { statusCode } = await post({ endpoint: favoritesAlbumsEndpoint, id: "wronguuid" });
    expect(statusCode).toBe(BAD_REQUEST);
  })

  it("should return unprocessed entity status when trying to add wrong track uuid", async () => {
    const { statusCode } = await post({ endpoint: favoritesTracksEndpoint, id: "wronguuid" });
    expect(statusCode).toBe(BAD_REQUEST);
  })

  it("should return unprocessed entity status when trying to add wrong artist uuid", async () => {
    const { statusCode } = await post({ endpoint: favoritesArtistsEndpoint, id: "wronguuid" });
    expect(statusCode).toBe(BAD_REQUEST);
  })
});