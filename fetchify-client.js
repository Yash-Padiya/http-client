import fetchify from "./fetchify.js";

export const apiClient = fetchify.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 1000,
  headers: { "Content-Type": "application/json", "x-secret-key": "jkafhkahga" },
});
apiClient.addRequestInterceptors(function (config){
  console.log("Intercepting the request...");
  return config;
}, function (err){
  return Promise.reject(err);
});
apiClient.addResponseInterceptors(function (response){
  console.log("Response received...");
  if(response.ok) return response.json()
  return response;
}, function(err){
  return Promise.reject(err);
})