import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SynjanaCustodialApi } from "@aurora-interactive/synjana-custodial-api";

const apiClient = new SynjanaCustodialApi()

export const useUserStore = create(
    persist((set, get) => ({
        apiToken: "",
        expiry: -1,

        refreshTokenIfExpiring: async () => {
            if (get().expiry === -1 || Date.now() > get().expiry) {
                const response = await apiClient.users.getApiV1UsersLogin({ email: get().email, password: get().password });
                if (!response.success) {
                    alert("Invalid username or password");
                    return;
                }

                set(s => ({ token: response.token, expiry: Date.now() + 24 * 60 * 60 * 1000, email: s.email, password: s.password })); // 1 day expiry in ms
                const userInfo = await apiClient.users.getApiV1UsersInfo({
                    headers: {
                        Authorization: `Bearer ${response.token}`
                    }
                });
                alert(`Username: ${userInfo.username}\nEmail: ${userInfo.email}\nName: ${userInfo.firstName}${userInfo.middleName !== null ? ` ${userInfo.middleName}` : ""} ${userInfo.lastName}\nAffiliated With Enterprise: ${userInfo.enterpriseAffiliationEntityName !== null ? "Yes" : "No"}`);
            } else console.log("Token is still fresh!");
        },
    })),
    {
        name: "synjana-webui"
    });