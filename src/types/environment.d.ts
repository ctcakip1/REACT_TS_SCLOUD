export {};

declare global {
    namespace NodeJS {
        interface Process {
            env: {
                NEXT_PUBLIC_BACKEND_URL: string;
                GITHUB_ID: string;
                GITHUB_SECRET: string;
                NEXTAUTH_URL: string;
                NO_SECRET: string;
            };
        }
    }
}
