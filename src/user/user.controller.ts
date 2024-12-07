import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import UserDto from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async getAll(): Promise<UserDto[]> {
    return this.userService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserDto> {
    return this.userService.getById(id);
  }

  @Post()
  async createUser(@Body() data: UserDto) {
    return this.userService.create(data)
  }
}
