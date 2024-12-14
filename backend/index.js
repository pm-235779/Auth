// import express from 'express';
// import dotenv from 'dotenv';
// dotenv.config();
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import { connectDB} from './db/connectDB.js';
// import authRouter from './routes/auth.route.js';
// import path from 'path';
// const app = express();
// const PORT = process.env.PORT || 3000;
// // app.get('/', (req, res) => {
// //     res.send('Hello World!');
// // });

// const __dirname = path.resolve();



// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }))
// app.use(express.json());
// app.use(cookieParser());
// app.use("/api/auth",authRouter);

// // app.use(express.static(path.join(__dirname, '../frontend/dist')));
// // app.get('*', (req, res) => {
// //     res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
// // });

// const staticPath = path.join(__dirname, '../frontend/dist');

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(staticPath));

//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(staticPath, 'index.html'), (err) => {
//             if (err) {
//                 console.error("Error serving index.html:", err.message);
//                 res.status(500).send("Error serving the frontend application.");
//             }
//         });
//     });
// }




// app.listen(5000, () => {
//     connectDB();
//     console.log('Server is running on port:' ,PORT);
// });



import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './db/connectDB.js';
import authRouter from './routes/auth.route.js';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware configuration
app.use(cors({
    origin: 'http://localhost:5173', // Update to your frontend's actual origin if necessary
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);

// Absolute path for the static directory
const staticPath = path.resolve('C:/Users/ASUS/OneDrive/Desktop/auth/frontend/dist');

if (process.env.NODE_ENV === 'production') {
    // Serve the static files from the updated path
    app.use(express.static(staticPath));

    // Handle unmatched routes by serving `index.html`
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(staticPath, 'index.html'), (err) => {
            if (err) {
                console.error("Error serving index.html:", err.message);
                res.status(500).send("Error serving the frontend application.");
            }
        });
    });
}

// Start the server
app.listen(PORT, () => {
    connectDB();
    console.log('Static Path:', staticPath);
    console.log('Serving index.html from:', path.resolve(staticPath, 'index.html'));
    console.log(`Server is running on port: ${PORT}`);
});
