import config from "../../config";
import tval from "./../tval";

import http, { IPostIData, IRes } from "./../http";


export const fetchProviderUrl = async (providerName: string): Promise<IRes> => {
  const token = localStorage.getItem("userToken");
  if (
    (!tval.isString(providerName) || !providerName.length)
    ||
    (!tval.isString(token) || !token.length)
  )
    return tval.res(false, "Token and/or Provider-name is not valid string");

  const url = `${config.baseUrl}/social_profiles/generate_url/${providerName}?token=${token}`;
  return http.get(url);

}

export const connectSocialProfileRequest = async (data: IPostIData): Promise<IRes> => {

  const providerName = localStorage.getItem("providerName");
  if (!tval.isString(providerName) || !providerName.length)
    return tval.res(false, "Provider-name is not valid string");

  const url = `${config.baseUrl}/social_profiles/connect/${providerName}`;
  return http.post(url, data);

}
