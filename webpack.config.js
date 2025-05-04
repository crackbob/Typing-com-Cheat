const path = require("path");
const { UserscriptPlugin } = require("webpack-userscript");

const commonConfig = {
    mode: "production",
    entry: "./src/main.js",
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    }
};

const userscriptConfig = {
    ...commonConfig,
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "Typingcom.user.js",
    },
    plugins: [
        new UserscriptPlugin({
            metajs: false,
            headers: {
                name: "Typing-com-Cheat",
                supportURL: "https://github.com/crackbob/Typing-com-Cheat",
                description: "we do a little trolling",
                version: "1.0.0",
                author: "crackbob",
                match: "*://typing.com/*",
                grant: "none",
            },
        }),
    ],
};

const regularScriptConfig = {
    ...commonConfig,
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "Typingcom.min.js",
    },
    plugins: [],
};

module.exports = [userscriptConfig, regularScriptConfig];
