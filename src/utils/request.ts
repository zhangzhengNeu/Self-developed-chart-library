type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const defaultOptions: RequestInit = {
  // credentials: 'include',
  // mode: 'cors',
};

const checkNet = (res: Response) => {
  const { ok, statusText } = res;
  if (ok) {
    return res.json();
  }
  return Promise.reject(statusText);
};

const request = (method: Method = 'GET') => (url: string, params: object = {}, options = {}) => {
  const controller = new AbortController();
  const signal = controller.signal;

  setTimeout(() => controller.abort(), 5000);

  const finalOptions: RequestInit = {
    ...defaultOptions,
    ...options,
    signal,
  };

  if (method !== 'GET') {
    finalOptions.body = JSON.stringify(params);
  }

  return fetch(url, finalOptions).then(checkNet);
};

export const GET = request();
export const POST = request('POST');
export const PUT = request('PUT');
export const DELETE = request('DELETE');
