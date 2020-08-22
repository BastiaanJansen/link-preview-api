import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as helmet from "helmet";
import * as csurf from "csurf";
import * as rateLimit from "express-rate-limit";
import { ValidationPipe, Logger } from "@nestjs/common";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.use(helmet());
	// app.use(csurf());
	app.use(
		rateLimit({
			windowMs: 15 * 60 * 1000, // 15 minutes
			max: 100 // limit each IP to 100 requests per windowMs
		})
	);

	await app.listen(process.env.PORT || 5000);
}
bootstrap();
