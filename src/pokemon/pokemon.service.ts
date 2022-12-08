import { BadRequestException, ConsoleLogger, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){

  }
  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
        
    } catch (error) {
      this.handleDBExceptions(error);    
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string): Promise<Pokemon> {
    let pokemon:Pokemon = null;
    if(isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term);
    } 
    else{
      const condition = {};
      if(this.isPositiveInteger(term)){
        condition['no'] = term;
      }
      else{
        condition['name'] = term;
      }
      pokemon = await this.pokemonModel.findOne(condition);
    }   
    if(!pokemon){
      throw new NotFoundException('Element not found');
    }
    return pokemon;
  }

  async findByNumber(no: number) {
    const pokemon = await this.pokemonModel.find({no: no});
    if(!pokemon){
      throw new NotFoundException('Element not found');
    }
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon: Pokemon = await this.findOne(term);
      const updatedPokemon = await pokemon.updateOne(updatePokemonDto, {new: true});
      return updatedPokemon.modifiedCount;        
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const result = await this.pokemonModel.deleteOne({_id:id});
    if(result.deletedCount===0){
      throw new BadRequestException(`Element doesn't exist`)
    }
    return;   
  }

  private isPositiveInteger(x: string) {
    return !isNaN(+x) && +x > 0
  }

  private handleDBExceptions(error){
    if(error.code === 11000){
      throw new BadRequestException('Duplicated element')
    }
    else{
      console.log(error);
      throw new InternalServerErrorException('Cant create element')
    }
  }
}
