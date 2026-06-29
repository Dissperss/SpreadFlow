import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import vitePluginSvgr from "vite-plugin-svgr";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react(), vitePluginSvgr()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/api/moex': {
                target: 'https://iss.moex.com/iss',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/moex/, ''),
            },
        },
    },
});
