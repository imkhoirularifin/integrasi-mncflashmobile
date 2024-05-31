import dotenv from 'dotenv';
import express from 'express';
import { TransactionRouter } from './router/transaction.router';
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// router
app.use('/api', new TransactionRouter().routes);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

export default app;
