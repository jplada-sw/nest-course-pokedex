import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { HttpAdapter } from '../common/interfaces/http-adapter.interface';
import { AxiosAdapter } from 'src/common/adapters/axios-adapter';

@Injectable()
export class SeedService {

  // incluímos esto para hacer clara la dependencia de axios
  private readonly axios: AxiosInstance = axios;
  private readonly adapter: AxiosAdapter;

  constructor(@InjectModel(Pokemon.name)
  private readonly pokemonModel: Model<Pokemon>, adapter: AxiosAdapter){
    this.adapter = adapter;
  }

  async runSeed() {
    try {
      await this.pokemonModel.deleteMany({});
      // const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');
      const data = await this.adapter.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=30');
      const insertPokemons: {no:number, name: string}[] = [];
      data.results.forEach(p => {
        const parts = p.url.split('/');
        const no:number = +parts[6];
        insertPokemons.push({
          no,
          name: p.name
        });
      });
      const result = await this.pokemonModel.insertMany(insertPokemons);
      return result;        
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

}
