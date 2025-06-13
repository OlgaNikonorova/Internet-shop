import { UsersService } from '@app/users/users.service';
import { GetUserId } from '@common/decorators/get-user-id.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { BulkUsersDto } from '@dto/users/bulk-users.dto';
import { UserPageDto } from '@dto/users/user-page.dto';
import { UserResponseDto } from '@dto/users/user-response.dto';
import { UserUpdateDto } from '@dto/users/user-update.dto';
import { UsersFiltersDto } from '@dto/users/users-filters.dto';
import { User } from '@entities/user.entity';
import { IUserService } from '@interfaces/user.service.interface';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from 'src/domain/enums/user-role.enum';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService)
    private readonly _usersService: IUserService,
  ) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Get all users', operationId: 'getUsers' })
  @ApiResponse({
    status: 200,
    description: 'Users list',
    type: UserResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async getAll(): Promise<UserResponseDto[]> {
    const users = await this._usersService.get();
    return users.map((u) => this.mapToResponseDto(u));
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  async getCurrentUser(
    @GetUserId('userId') userId: string,
  ): Promise<UserResponseDto> {
    const user = await this._usersService.getCurrentUser(userId);
    return this.mapToResponseDto(user);
  }

  @Get('page')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Get paginated users',
    operationId: 'getPaginatedUsers',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users with pagination params',
    type: UserPageDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async getAllPage(
    @Query() filtersDto: UsersFiltersDto,
  ): Promise<UserPageDto> {
    const page = await this._usersService.getPage(filtersDto);

    return {
      page: page.page,
      users: page.users.map((u) => this.mapToResponseDto(u)),
    };
  }

  @Get('email')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Get user by email', operationId: 'getUserByEmail' })
  @ApiQuery({
    name: 'email',
    description: 'User email',
    example: 'user@example.com',
  })
  @ApiResponse({
    status: 200,
    description: 'User details',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async getByEmail(
    @Query('email') email: string,
  ): Promise<UserResponseDto> {
    console.log(email);
    const user = await this._usersService.findByEmail(email);
    return this.mapToResponseDto(user);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Get user by ID', operationId: 'getUserById' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User details',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async getById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this._usersService.findById(id);
    return this.mapToResponseDto(user);
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Update user role', operationId: 'updateUserRole' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          enum: Object.values(UserRole),
          example: UserRole.Admin,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User role updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async updateRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
  ): Promise<UserResponseDto> {
    const updatedUser = await this._usersService.updateRole(id, role);
    return this.mapToResponseDto(updatedUser);
  }

  @Post(':id/ban')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Ban user', operationId: 'banUser' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User banned successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async ban(@Param('id') id: string): Promise<UserResponseDto> {
    const bannedUser = await this._usersService.ban(id);
    return this.mapToResponseDto(bannedUser);
  }

  @Post(':id/unban')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Unban user', operationId: 'unbanUser' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User unbanned successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async unban(@Param('id') id: string): Promise<UserResponseDto> {
    const unbannedUser = await this._usersService.unban(id);
    return this.mapToResponseDto(unbannedUser);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user', operationId: 'updateUserById' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UserUpdateDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden: Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async updateById(
    @GetUserId('userId') currentUserId: string,
    @Param('id') id: string,
    @Body() updateUserDto: UserUpdateDto,
  ): Promise<UserResponseDto> {
    const currentUser = await this._usersService.findById(currentUserId);

    if (currentUserId !== id && currentUser.role !== UserRole.Admin) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const updatedUser = await this._usersService.update(id, updateUserDto);
    return this.mapToResponseDto(updatedUser);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id', operationId: 'deleteUserById' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden: Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async remove(
    @GetUserId('userId') currentUserId: string,
    @Param('id') id: string,
  ): Promise<void> {
    const currentUser = await this._usersService.findById(currentUserId);

    if (currentUserId !== id && currentUser.role !== UserRole.Admin) {
      throw new ForbiddenException('You can only delete your own profile');
    }

    return await this._usersService.delete(id);
  }

  @Post('bulk')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Bulk update users',
    operationId: 'bulkUpdateUsers',
  })
  @ApiBody({ type: BulkUsersDto })
  @ApiResponse({
    status: 200,
    description: 'Users updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async bulkUpdate(@Body() bulkDto: BulkUsersDto): Promise<void> {
    await this._usersService.bulkUpdate(bulkDto);
  }

  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      address: user.address,
      phone: user.phone,
      avatar: user.avatar,
    };
  }
}
