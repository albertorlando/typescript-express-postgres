import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { User } from '../interfaces/users.interface';
import userModel from '../models/users.model';
import { isEmptyObject } from '../utils/util';

class UserService {
  public users = userModel;

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await this.users.findAll();
    return users;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await this.users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "Invalid User");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmptyObject(userData)) throw new HttpException(400, "Invalid User");

    const findUser: User = await this.users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `Email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async updateUser(userId: number, userData: User): Promise<User> {
    if (isEmptyObject(userData)) throw new HttpException(400, "Invalid User Info");

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const updateUser: User = await this.users.update({ ...userData, password: hashedPassword }, { where: { id: userId } });
    if (!updateUser) throw new HttpException(409, "Invalid User");

    return updateUser;
  }

  public async deleteUserData(userId: number): Promise<User> {
    const deleteUser: User = await this.users.destroy({ where: { id: userId } });
    if (!deleteUser) throw new HttpException(409, "Invalid User");

    return deleteUser;
  }
}

export default UserService;
