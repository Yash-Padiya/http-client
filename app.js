import { apiClient } from "./fetchify-client.js";

async function getProducts() {
  const response = await apiClient.get("/posts?_limit=2", { timeout: 10000 });
  console.log("GET api response", response);
}
getProducts();
async function addProduct() {
  let data = {
    title: "foo",
    body: "bar",
    userId: 1,
  };
  const res = await apiClient.post("/posts", data, { timeout: 10000 });
  console.log("POST api response: ", res);
}
addProduct();
async function updateProduct() {
  let data = {
    id: 1,
    title: 'updating title',
    body: 'updating body',
    userId: 1,
  };
  const res = await apiClient.put(`/posts/${data.id}`, data, {
    timeout: 10000,
  });
  console.log("PUT api response: ", res);
}
updateProduct();
async function patchProduct() {
  let data = {
    id: 109,
    title: "patching title",
    userId: 1,
  };
  const res = await apiClient.patch(`/posts/${data.id}`, data, {
    timeout: 10000,
  });
  console.log("PATCH api response: ", res);
}
patchProduct();
async function deleteProduct(id) {
  const res = await apiClient.delete(`/posts/${id}`, { timeout: 10000 });
  console.log("DELETE api response: ", res);
}
deleteProduct(101)
