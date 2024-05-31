import { Router } from 'express';
import { TransactionController } from '../controller/transaction.controller';

export class TransactionRouter {
	private transactionController: TransactionController;

	constructor() {
		this.transactionController = new TransactionController();
	}

	public get routes(): Router {
		const router = Router();

		router.post('/transactions', this.transactionController.createTransaction);
		router.post(
			'/transactions/webhook',
			this.transactionController.handleWebhook
		);

		return router;
	}
}
