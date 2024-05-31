import { IRequestData } from '../interface/dto/IRequestData';
import { MncService } from '../service/mnc.service';
import { Request, Response } from 'express';
import axios from 'axios';
import { IResponseData } from '../interface/dto/IResponseData';

export class TransactionController {
	private mncService: MncService;

	constructor() {
		this.mncService = new MncService();
		this.createTransaction = this.createTransaction.bind(this);
		this.handleWebhook = this.handleWebhook.bind(this);
	}

	public async createTransaction(req: Request, res: Response): Promise<void> {
		const requestData: IRequestData = req.body;

		// remove signature from request body if exist
		delete requestData.signature;

		const signature = await this.mncService.generateSignature(requestData);
		requestData.signature = signature;

		try {
			const response = await axios.post(
				'https://app.flashmobile.co.id/priv/v1/pg/token',
				requestData
			);
			// return response with status 200 and response data
			res.status(200).send(response.data);
		} catch (error: any) {
			res.status(500).send({
				message: 'Internal server error',
				error: error.message,
			});
		}
	}

	public async handleWebhook(req: Request, res: Response): Promise<void> {
		const callbackData: IResponseData = req.body;

		console.log('Callback data: ', callbackData);

		res.status(200).send('OK');
	}
}
