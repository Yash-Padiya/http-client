class Fetchify {
  config = {
    timeout: 1000,
    headers: { "Content-Type": "application/json" },
  };
  #requestInterceptors = [];
  #responseInterceptors = [];
  constructor(config) {
    this.config = this.#mergeConfig(config);
  }
  async #request({ url, reqConfig }) {
    const finalConfig = this.#mergeConfig(reqConfig);
    let promise = Promise.resolve({ url, reqConfig: finalConfig });
    let chains = [
      ...this.#requestInterceptors,
      { successFn: this.#dipatchRequest.bind(this) },
      ...this.#responseInterceptors,
    ];
    chains.forEach(({ successFn, failureFn }, index) => {
      promise = promise.then(
        (res) => {
          try {
            return successFn(res);
          } catch (err) {
            if (failureFn) return failureFn(err);
            return Promise.reject(err);
          }
        },
        (err) => {
          if (failureFn) return failureFn(err);
          return Promise.reject(err);
        }
      );
    });
    return promise;
  }
  async #dipatchRequest({ url, reqConfig }) {
    const finalConfig = this.#mergeConfig(reqConfig);
    const abortController = new AbortController();
    let timeout = finalConfig?.timeout || 0;
    let timeoutId;
    if (timeout) {
      timeoutId = setTimeout(() => abortController.abort(), timeout);
    }

    try {
      const response = await fetch(`${this.config.baseURL}/${url}`, {
        ...finalConfig,
        signal: abortController.signal,
      });
      return response;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }
  async get(url, reqConfig) {
    return this.#request({
      url,
      reqConfig: { ...reqConfig, method: "GET" },
    });
  }
  async post(url, data, reqConfig) {
    let body = { ...data };
    return this.#request({
      url,
      reqConfig: { ...reqConfig, body: JSON.stringify(body), method: "POST" },
    });
  }
  async put(url, data, reqConfig) {
    let body = { ...data };
    return this.#request({
      url,
      reqConfig: { ...reqConfig, body: JSON.stringify(body), method: "PUT" },
    });
  }
  async patch(url, data, reqConfig) {
    let body = { ...data };
    return this.#request({
      url,
      reqConfig: { ...reqConfig, body: JSON.stringify(body), method: "PATCH" },
    });
  }
  async delete(url, data, reqConfig) {
    return this.#request({
      url,
      reqConfig: { ...reqConfig, method: "DELETE" },
    });
  }

  #mergeConfig(config) {
    return {
      ...this.config,
      ...config,
      headers: {
        ...(this.config.headers || {}),
        ...(config?.headers || {}),
      },
    };
  }
  addRequestInterceptors(successFn, failureFn) {
    this.#requestInterceptors.push({ successFn, failureFn });
  }
  addResponseInterceptors(successFn, failureFn) {
    this.#responseInterceptors.push({ successFn, failureFn });
  }
}

function create(config) {
  return new Fetchify(config);
}
export default { create };
