/**
 * Wallet Service
 * --------------
 * API layer for ForgeCoins wallet endpoints.
 */

import { apiFetch } from "./apiClient";
import type { WalletResponse, TransactionsResponse } from "../types/idea.types";

const walletService = {
  async getWallet(): Promise<WalletResponse> {
    return apiFetch<WalletResponse>("/wallet");
  },

  async getTransactions(params?: { page?: number; limit?: number }): Promise<TransactionsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();
    return apiFetch<TransactionsResponse>(`/wallet/history${qs ? `?${qs}` : ""}`);
  },
};

export default walletService;
