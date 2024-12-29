import { mockedDB } from "../../../database";

export function isFavoritesCollectionKey (str: string): str is keyof typeof mockedDB.favorites {
  return Object.keys(mockedDB.favorites).includes(str);
}