import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  // incluímos esto para hacer clara la dependencia de axios
  private readonly axios: AxiosInstance = axios;

  async runSeed() {
    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=1');
    data.results.forEach(p => {
      const parts = p.url.split('/');
      const no:number = +parts[6];
      console.log(p.url, no);
    })
    return data;
  }

}
