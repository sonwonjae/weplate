import { Injectable } from '@nestjs/common';

@Injectable()
export class PingService {
  constructor() {}
  ping() {
    return 'pong' as const;
  }
}
