import api, { csrf } from "./api";

export async function loginMother(email, password) {
    await csrf.get("/sanctum/csrf-cookie");

    const res = await api.post("/mother/login", { email, password });

    // Save the token
    localStorage.setItem("token", res.data.token);

    return res.data;
}

export function logoutMother() {
    localStorage.removeItem("token");
    return api.post("/mother/logout");
}
