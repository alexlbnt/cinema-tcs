import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  // A rota GET / foi removida para permitir que o ServeStaticModule entregue o portal Frontend (React)
}
