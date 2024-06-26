export interface IGetQueryParams {
  [key: string]: any;
}

const getQueryParams = (): IGetQueryParams => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return Object.fromEntries(urlParams.entries());
}

export interface IGetParams {
  userToken: string | null;
  providerName: string | null;
  providerCode: string | undefined;
  error_description: string | undefined;
}

const getParams = (readFromStorage: boolean = false): IGetParams => {
  const lsData = [localStorage.getItem("userToken"), localStorage.getItem("providerName")];
  const source = readFromStorage ? lsData : window.location.pathname.split("/").slice(-2);
  const [userToken, providerName] = source;
  const { code, error_description } = getQueryParams()
  return {
    userToken,
    providerName,
    providerCode: code,
    error_description
  }
};

export default getParams;
