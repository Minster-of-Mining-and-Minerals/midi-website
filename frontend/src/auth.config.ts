import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password } = credentials;

        try {
          // Use internal docker network API URL when available
          const backendUrl = process.env.INTERNAL_API_URL
            ? `${process.env.INTERNAL_API_URL}/auth/login`
            : process.env.NODE_ENV === "production"
            ? "http://backend:4000/api/auth/login"
            : `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000/api"}/auth/login`;

          console.log("Auth attempt to:", backendUrl);

          // Add a timeout to prevent hanging requests
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

          const res = await fetch(backendUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({ email, password }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          console.log("Authorize response status:", res.status);

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error("Auth failed with status:", res.status, "Error:", errorData);
            return null;
          }

          const data = await res.json();
          console.log("Auth response success:", data?.success);

          if (!data?.success || !data?.data?.user) {
            console.error("Auth response missing user data");
            return null;
          }

          const user = data.data.user;
          const token = data.token || data.data?.token;

          if (!token) {
            console.error("No token in response");
            return null;
          }

          return {
            accessToken: token,
            id: String(user.user_id),
            email: user.email,
            name: user.full_name,
            phone_number: user.phone_number,
            profile_image: user.profile_image,
            is_first_logged_in: user.is_first_logged_in,
            sector: user.sector,
            department: user.department,
          };

        } catch (err: any) {
          if (err.name === 'AbortError') {
            console.error("Authorize request timed out after 10s");
          } else {
            console.error("Authorize error exception:", err.message || err);
          }
          return null;
        }
      },
    }),
  ],

  // 🔥 ADD BASE PATH FOR DOCKER
  basePath: "/api/auth",
} satisfies NextAuthConfig;
