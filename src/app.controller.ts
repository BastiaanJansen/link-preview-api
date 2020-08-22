import {
	Controller,
	Get,
	Param,
	Query,
	ValidationPipe,
	BadRequestException,
	Body
} from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	async getLinkPreviews(@Query("text", ValidationPipe) text: string) {
		if (!text) throw new BadRequestException();
		return this.appService.getLinkPreviews(text);
	}
}
