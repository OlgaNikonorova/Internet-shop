import { BulkUsersDto } from '@dto/users/bulk-users.dto';
import { UserUpdateDto } from '@dto/users/user-update.dto';
import { UsersFiltersDto } from '@dto/users/users-filters.dto';
import { User } from '@entities/user.entity';
import { IUserService } from '@interfaces/user.service.interface';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderBy } from 'src/domain/enums/order-by.enum';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { UserStatus } from 'src/domain/enums/user-status.enum';
import { UsersSortField } from 'src/domain/enums/users-sort-field.enum';
import { UserPage } from 'src/domain/models/user-page';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
  ) {}

  public async get(): Promise<User[]> {
    return await this._usersRepository.find();
  }

  public async getPage(filters: UsersFiltersDto): Promise<UserPage> {
    const queryBuilder = this._usersRepository.createQueryBuilder('user');

    if (filters.search) {
      queryBuilder.andWhere(
        `(user.name LIKE :search OR user.email LIKE :search OR user.phone LIKE :search OR user.address LIKE :search OR user.username LIKE :search)`,
        { search: `%${filters.search}%` },
      );
    }

    if (filters.role) {
      queryBuilder.andWhere('user.role = :role', {
        role: filters.role,
      });
    }

    if (filters.createdDateFrom) {
      queryBuilder.andWhere('user.createdAt >= :createdDateFrom', {
        createdDateFrom: filters.createdDateFrom,
      });
    }

    if (filters.createdDateTo) {
      queryBuilder.andWhere('user.createdAt <= :createdDateTo', {
        createdDateTo: filters.createdDateTo,
      });
    }

    if (filters.updatedDateFrom) {
      queryBuilder.andWhere('user.updatedAt >= :updatedDateFrom', {
        updatedDateFrom: filters.updatedDateFrom,
      });
    }

    if (filters.updatedDateTo) {
      queryBuilder.andWhere('user.updatedAt <= :updatedDateTo', {
        updatedDateTo: filters.updatedDateTo,
      });
    }

    queryBuilder
      .orderBy(
        filters.sortField ?? UsersSortField.UpdatedAt,
        filters.orderBy === OrderBy.Ascending ? 'ASC' : 'DESC',
      )
      .skip(filters.skip)
      .take(filters.pageSize);

    const pageSize = filters.pageSize ?? 10;
    const pageIndex = filters.pageIndex ?? 1;

    const [users, totalCount] = await queryBuilder.getManyAndCount();

    return {
      page: {
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        pageIndex: pageIndex,
        hasNextPage: pageIndex < Math.ceil(totalCount / pageSize),
        hasPreviousPage: pageIndex > 1,
      },
      users,
    };
  }

  public async create(user: User): Promise<void> {
    await this._usersRepository.save(user);
  }

  public async findById(id: string): Promise<User> {
    const user = await this._usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  public async findByEmail(email: string): Promise<User> {
    console.log(email);
    const user = await this._usersRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  public async getCurrentUser(userId: string): Promise<User> {
    return await this.findById(userId);
  }

  public async update(id: string, userUpdateDto: UserUpdateDto): Promise<User> {
    await this._usersRepository.update(id, userUpdateDto);
    return (await this._usersRepository.findOneBy({ id }))!;
  }

  public async updateRole(id: string, role: UserRole): Promise<User> {
    const user = await this.findById(id);
    user.role = role;
    await this._usersRepository.save(user);
    return user;
  }
  public async ban(id: string): Promise<User> {
    const user = await this.findById(id);

    if (user.status === UserStatus.Banned) {
      throw new BadRequestException(`User with ID ${id} is already banned`);
    }

    user.status = UserStatus.Banned;

    await this._usersRepository.save(user);
    return user;
  }

  public async unban(id: string): Promise<User> {
    const user = await this.findById(id);

    if (user.status === UserStatus.Active) {
      throw new BadRequestException(`User with ID ${id} is not banned`);
    }

    user.status = UserStatus.Active;

    await this._usersRepository.save(user);
    return user;
  }

  public async bulkUpdate(bulkDto: BulkUsersDto): Promise<void> {
    if (!bulkDto.role && !bulkDto.status) {
      throw new BadRequestException(
        'At least one of role or status must be provided',
      );
    }


    const updateData: Partial<User> = {};
    if (bulkDto.role) {
      updateData.role = bulkDto.role;
    }
    if (bulkDto.status) {
      updateData.status = bulkDto.status;
    }

    await this._usersRepository
      .createQueryBuilder()
      .update(User)
      .set(updateData)
      .where('id IN (:...userIds)', { userIds: bulkDto.userIds })
      .execute();
  }

  public async delete(id: string): Promise<void> {
    await this._usersRepository.delete(id);
  }

  
}
