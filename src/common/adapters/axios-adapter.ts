import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AxiosAdapter implements HttpAdapter{
    // incluímos esto para hacer clara la dependencia de axios
    private axios: AxiosInstance = axios;

    public async get<T>(url: string) {
        try {
            const result = await this.axios.get<T>(url);
            return result.data;                
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    }
}