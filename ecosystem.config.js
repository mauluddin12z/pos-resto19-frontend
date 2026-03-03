module.exports = {
    apps: [
        {
            name: "pos-resto-frontend",
            script: "npm",
            args: "start",
            env: {
                NODE_ENV: "production",
                PORT: 3000
            }
        }
    ]
}