const BASE_URL = "http://localhost:5000/api/plots";

export async function getPlots() {
  const res = await fetch(BASE_URL);
  return res.json();
}

export async function deletePlot(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
