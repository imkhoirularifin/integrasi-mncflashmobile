import { IRequestData } from '../interface/dto/IRequestData';
import md5 from 'md5';
import * as crypto from 'crypto';

export class MncService {
	private serverKey = process.env.MNC_SERVER_KEY;

	constructor() {
		if (!this.serverKey) {
			throw new Error('MNC_SERVER_KEY is not defined');
		}
	}

	private getDate(): string {
		const date = new Date();
		let formattedDate = '';

		formattedDate += date.getUTCFullYear(); // gets the year
		formattedDate += ('0' + (date.getUTCMonth() + 1)).slice(-2); // gets the month
		formattedDate += ('0' + date.getUTCDate()).slice(-2); // gets the day
		formattedDate += ('0' + date.getUTCHours()).slice(-2); // gets the hours
		formattedDate += ('0' + date.getUTCMinutes()).slice(-2); // gets the minutes
		formattedDate += ('0' + date.getUTCSeconds()).slice(-2);

		return formattedDate;
	}

	private hashSha1(data: string): string {
		const hash = crypto.createHash('sha1');
		hash.update(data);
		return hash.digest('hex');
	}

	public async generateSignature(requestData: IRequestData): Promise<string> {
		const dateTime = this.getDate();

		requestData.datetime_request = dateTime;

		// contatenate all the request data value and insert into md5, then hash with sha1
		const data = Object.values(requestData).join('') + this.serverKey;
		const md5Hash = md5(data);
		const signature = this.hashSha1(md5Hash);

		return signature;
	}
}
