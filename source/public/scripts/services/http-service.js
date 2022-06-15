class HttpService {
  async ajax(method, url, data, headers) {
    const fetchHeaders = new Headers({ 'content-type': 'application/json', ...{ headers } || {} })

    try {

      const response = await fetch(url, {
        method,
        headers: fetchHeaders,
        body: JSON.stringify(data)
      })

      return await  response.json();

    }catch (error) {
      return 404;
    }
  }
}

export const httpService = new HttpService();
