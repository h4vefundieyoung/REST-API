import path from "path";
import { fileURLToPath } from "url";

const isProduction = process.env.NODE_ENV == 'production';

const config = {
    target: "node",
    entry: './src/index.ts',
    output: {
        path: path.resolve( fileURLToPath(path.dirname(import.meta.url)), 'dist'),
        filename: "[name].bundle.cjs",
        publicPath: '/dist/'
    },
    plugins: [],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
};

export default () => {
    if (isProduction) {
        config.mode = 'production';
        
        
    } else {
        config.mode = 'development';
    }
    return config;
};
