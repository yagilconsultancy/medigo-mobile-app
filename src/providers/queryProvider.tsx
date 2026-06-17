import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Alert } from "react-native";
import { AxiosError } from "axios";
import { ErrorResponse } from "../types/auth.types";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      onError: (error: unknown) => {
        // Global error handling for mutations
        const axiosError = error as AxiosError<ErrorResponse>;
        const errorMessage =
          axiosError?.response?.data?.detail ||
          axiosError?.message ||
          "An error occurred";

        const displayMessage =
          typeof errorMessage === "string"
            ? errorMessage
            : errorMessage[0]?.msg || "An error occurred";

        Alert.alert("Error", displayMessage);
        console.error("Mutation error:", error);
      },
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export { queryClient };
