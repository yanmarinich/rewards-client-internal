// import config from "@app/config";
import tval from "@app/utils/tval";

export interface IHeaders {
  [key: string]: string
}
export interface IPostIData {
  [key: string]: any
}

export interface IRes {
  success: boolean;
  message: string;
  data?: any;
}

const res = (success: boolean, message: string, data?: any): IRes => {
  return { success, message, data };
}

const process = async (response: Response): Promise<IRes> => {
  if (!response?.ok)
    return res(false, `Request failed with status: ${response.status}`);
  const json = await response.json();
  return res(true, "success", json);
}

const getRequest = async (url: string): Promise<IRes> => {
  try {
    const response = await fetch(url);
    return await process(response);
  } catch (e: any) {
    console.error(`#http:get: (url: ${url}): ${e.message}`);
    return res(false, e.message);
  }
};

const postRequest = async (url: string, data: IPostIData, headers?: IHeaders): Promise<IRes> => {

  try {
    headers = tval.getObject(headers, {});
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...headers,
      },
      body: JSON.stringify(data),
    });

    return await process(response);

  } catch (e: any) {
    console.error(`#http:post: (url: ${url}): ${e.message}`);
    return res(false, e.message);
  }
};


export default {
  get: getRequest,
  post: postRequest,
};


