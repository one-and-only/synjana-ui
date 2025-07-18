import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SynjanaCustodialApi } from "@aurora-interactive/synjana-custodial-api";

const apiClient = new SynjanaCustodialApi()

export const useUserStore = create(
    persist((set, get) => ({
        apiToken: "",
        expiry: -1,

        refreshTokenIfExpiring: async (email, password) => {
            if (get().expiry === -1 || Date.now() > get().expiry) {
                const response = await apiClient.users.usersLogin({ email: email, password: password });
                if (!response.success) {
                    alert("Invalid username or password");
                    return;
                }

                set(s => ({ apiToken: response.token, expiry: Date.now() + 24 * 60 * 60 * 1000 })); // 1 day expiry in ms
            } else console.log("Token is still fresh!");
        },
    }), {
        name: "synjana-webui"
    }));