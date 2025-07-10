declare module 'path-match' {
  type PathMatch = {
    (path: string): (pathname: string) => false | { [key: string]: string };
  };
  const createPathMatch: () => PathMatch;
  export default createPathMatch;
}
