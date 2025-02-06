import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword } from 'src/utils';
import { LoginDto } from '../dtos/auth/login.dto';
import { AuthHelperService } from './auth.helper';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly authHelperService: AuthHelperService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email);

    if (!user) throw new NotFoundException('Invalid email or password');

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      throw new BadRequestException('Invalid email or password');

    return user;
  }

 
  /**
   * Asynchronously authenticate a user based on the provided login credentials.
   *
   * @param {LoginDto} loginDto - The DTO containing the user's login credentials.
   * @param {string} loginDto.email - The email address of the user.
   * @param {string} loginDto.password - The password associated with the user's account.
   *
   * @returns {Promise<ILogin> } An object containing the status code, message, and payload of the login operation.
   *
   * @throws {Error} Throws an error if the user is not found, the email is not verified, or the password is incorrect.
   */
  async login(loginDto: LoginDto) {
    // Check if a user with the provided email exists
    const user = await this.usersService.findOne(
     loginDto.email.toLowerCase() 
    );

    if (!user) {
      throw new RpcException({
        message: "USER_NOT_EXISTS",
        statusCode: HttpStatus.NOT_FOUND, // Set the desired status code
      })
      
    }

    // Check if the user is verified via OTP
    // if (!user.emailVerifiedAt) {
    //   const OTP = this.authHelperService.generateOTP();

    //   // Generate OTP expiration time
    //   const OTPExpireAt = this.authHelperService.generateExpiryTime();
    //   this.emailService.sendMail({
    //     to: loginDto.email,
    //     subject: EEmailSubjectKeys.REGISTER_EMAIL_SUBJECT,
    //     html: registrationTemplate(user.fullName, OTP),
    //   });
    //   await this.userModel.findOneAndUpdate(
    //     { _id: user._id },
    //     {
    //       OTP,
    //       OTPExpireAt,
    //     },
    //   );

    //   throw new HttpException(
    //     EErrorMessages.USER_NOT_VERIFIED,
    //     HttpStatus.NOT_ACCEPTABLE,
    //   );
    // }

    // Check Password
    const isCorrect = this.authHelperService.comparePassword(
      loginDto.password,
      user.password || '',
    );

    if (!isCorrect) {
      throw new RpcException({
        message: "INVALID_PASSWORD",
        statusCode: HttpStatus.CONFLICT, // Set the desired status code
      })
    }
    const payload={
      _id:user._id,
      email:user.email,
      isAdmin:user.isAdmin
    }
    // generating auth token
    const token = this.jwtService.sign(payload)
    //remove pass
    user.password = '';
    return {
      user: user,
      token,
    };
  }

  async register(fullName: string, email: string, password: string) {
    const existingUser = await this.usersService.findOne(email);

    if (existingUser) throw new RpcException({
      message: 'Email is already in use.',
      statusCode: HttpStatus.CONFLICT, // Set the desired status code
    })

    const encryptedPassword = await encryptPassword(password);

    const user = await this.usersService.create({
      email,
      password: encryptedPassword,
      isAdmin: false,
      fullName,
    });

    return user;
  }
}
