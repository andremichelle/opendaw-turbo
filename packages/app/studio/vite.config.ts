import {defineConfig} from "vite"
import crossOriginIsolation from "vite-plugin-cross-origin-isolation"
import {readFileSync} from "fs"
import {resolve} from "path"

export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src")
        }
    },
    server: {
        port: 8080,
        host: "localhost",
        https: {
            key: readFileSync("../localhost-key.pem"),
            cert: readFileSync("../localhost.pem")
        },
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp"
        },
        fs: {
            // Allow serving files from the entire workspace
            allow: [".."]
        }
    },
    plugins: [
        crossOriginIsolation(),
        {
            name: "spa",
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    const url: string | undefined = req.url
                    if (url !== undefined && url.indexOf(".") === -1 && !url.startsWith("/@vite/")) {
                        const indexPath = resolve(__dirname, "index.html")
                        res.end(readFileSync(indexPath))
                    } else {
                        next()
                    }
                })
            }
        }
    ]
})