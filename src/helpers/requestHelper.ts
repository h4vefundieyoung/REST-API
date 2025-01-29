import { IncomingMessage, request } from "node:http";
import { join } from "path";

type endpointsObject = typeof RequestHelper.endpoints;
type endpoints = endpointsObject[keyof endpointsObject];
type postEndpoints = Exclude<endpoints, "/favorites">;
type postRequestIdHelper<T> = T extends Exclude<postEndpoints, "/albums" | "/artists" | "/tracks" | "/users"> ? string : null;
type postRequestBodyHelper<T> = T extends Exclude<postEndpoints, "/favorites/tracks" | "/favorites/albums" | "/favorites/artists"> ? string: null;
type deleteEndpoints = Exclude<endpoints, "/favorites">;
type putEndpoints = Exclude<endpoints, "/favorites">;
type getEndpoints = Exclude<endpoints, "/favorites/tracks" | "/favorites/albums" | "/favorites/artists">;
type GetResponseDataHelper<T, Z> = T extends string ? Z : Z[]
type GetResponseDataTypeHelper<T, Z> = 
  T extends endpointsObject["albumsEndpoint"] ? GetResponseDataHelper<Z, AlbumDTO> : 
  T extends endpointsObject["artistsEndpoint"] ? GetResponseDataHelper<Z, ArtistDTO> : 
  T extends endpointsObject["tracksEndpoint"] ? GetResponseDataHelper<Z, TrackDTO> : 
  T extends endpointsObject["usersEndpoint"] ? GetResponseDataHelper<Z, UserDTO> : 
  T extends endpointsObject["favoritesEndpoint"] ? FavoritesDTO : never
type GetResponse<T, Z> = Promise<{
  res: IncomingMessage,
  data: GetResponseDataTypeHelper<T, Z>
}>
type requestArgs<T, Z, E> = {
  body?: E
  endpoint: T
  id?: Z
}

const host = process.env.APP_HOST || `localhost`;
const port = process.env.PORT || 4000;


export class RequestHelper {
  static endpoints = {
    usersEndpoint: "/users",
    albumsEndpoint: "/albums",
    artistsEndpoint: "/artists",
    tracksEndpoint: "/tracks",
    favoritesEndpoint: "/favorites",
    favoritesTracksEndpoint: "/favorites/tracks",
    favoritesAlbumsEndpoint: "/favorites/albums",
    favoritesArtistsEndpoint: "/favorites/artists"
  } as const;

  static get<T extends getEndpoints, Z> ({ endpoint, id }: requestArgs<T, Z, string>): GetResponse<T, Z> {
    const path = typeof id === "string" ? join(endpoint, id) : endpoint;
    return new Promise((resolve) => {
      const req = request({ host, port, path, method: "GET" }, (res) => {
        let data = "";
        res.on("data", (chunk) => data += chunk);
        res.on("end", () => resolve({ data: data && JSON.parse(data), res }));
      });
      req.end();
    })
  }

  static post<T extends postEndpoints> ({ endpoint, id, body }: requestArgs<T, postRequestIdHelper<T>, postRequestBodyHelper<T>>): Promise<IncomingMessage> {
    const path = id ? join(endpoint, id) : endpoint;
    return new Promise((res) => {
      const req = request({ host, port, path, method: "POST" }, res);
      body && req.write(body);
      req.end();
    })
  }

  static del ({ endpoint, id }: requestArgs<deleteEndpoints, string, void> & { id: string }): Promise<IncomingMessage> {
    return new Promise((res) => {
      const req = request({ host, port, path: join(endpoint, id), method: "DELETE" }, res);
      req.end();
    })
  }

  static put ({ endpoint, id, body }: Required<requestArgs<deleteEndpoints, string, string>>): Promise<IncomingMessage> {
    return new Promise((res) => {
      const req = request({ host, port, path: join(endpoint, id), method: "PUT" }, res);
      req.write(body);
      req.end();
    })
  }
}