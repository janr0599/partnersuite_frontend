/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            backgroundImage: {
                "auth-background": "url('/bg-pattern.svg')",
            },
        },
    },
    plugins: [],
};
