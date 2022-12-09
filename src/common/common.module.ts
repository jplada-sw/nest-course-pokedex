import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios-adapter';
import { HttpAdapter } from './interfaces/http-adapter.interface';

@Module({
    providers: [AxiosAdapter],
    exports: [AxiosAdapter]
})
export class CommonModule {}
