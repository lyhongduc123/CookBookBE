// src/modules/auth/auth.service.ts
import { Injectable, BadRequestException, UnauthorizedException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto, TokenDto } from './dtos/login.dto';
import { ForgotDto } from './dtos/forgot.dto';
import { ResetPassword1Dto, ResetPassword2Dto } from './dtos/reset-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '../mailer/mailer.service';
import { v4 as uuidv4 } from 'uuid';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { Post } from '../posts/entities/post.entity';
import { FullReponsePostDto, LiteReponsePostDto, ReponseUserDto, ReponseUserProfileDto } from '../posts/dtos/create-post.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import * as fileType from 'file-type';
import { randomInt } from 'crypto';
import { GetRecipeDto } from './dtos/aichef.dto';

@Injectable()
export class AuthService {
  [x: string]: any;
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  }
  async getUserIdFromToKen(token: string): Promise<number> {
    const payload = this.jwtService.decode(token);
    return payload['sub'];
  }
  async register(registerDto: RegisterDto, baseUrl: string): Promise<any> {
    
    try {
      let { username, email, password, name } = registerDto;
      if(name === null || name === undefined){
        name = "Ham ăn " + randomInt(10000, 99999);
      }
      const existingUser = await this.usersRepository.findOne({ where: [{ email }, { username }] });

      if (existingUser?.isActive) {
        throw new BadRequestException('Email hoặc tên đăng nhập đã được sử dụng.');
      }
      if(existingUser){
        await this.usersRepository.delete(existingUser.id);
      }
      const hashedPassword = await bcrypt.hash(password, 10);


      const user = this.usersRepository.create({
        username,
        email,
        name,
        password: hashedPassword,
        isActive: false,
        verificationToken: uuidv4(),
      });

      await this.usersRepository.save(user);
      const url = `${baseUrl}/auth/verify-email?token=${user.verificationToken}`;
      await this.mailerService.sendVerificationEmail(user.username, user.email, user.verificationToken, baseUrl);

      return { message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực.'};
    } 
    catch (error) {
      if (error instanceof BadRequestException) {
      throw error;
      }
      console.log(error);
      throw new BadRequestException('Có lỗi xảy ra trong quá trình đăng ký.');
    }
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { username, password, tokenFCM } = loginDto;
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException('Sai tên đăng nhập hoặc mật khẩu.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Sai tên đăng nhập hoặc mật khẩu.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản chưa được xác thực.');
    }

    const payload = { sub: user.id, username: user.username, roles: user.roles };
    const token = this.jwtService.sign(payload);

    if(tokenFCM !== null && tokenFCM !== undefined){
      user.tokenFCM = tokenFCM;
      await this.usersRepository.save(user);
    }
    return { access_token: token, message: 'Đăng nhập thành công', user: new ReponseUserDto(user) };
  }

  async verifyEmail(token: string): Promise<string> {
    const user = await this.usersRepository.findOne({ where: { verificationToken: token } });
    
    if (!user) {
      return `
        <!DOCTYPE html>
        <html lang="vi">
          <head>
            <meta charset="UTF-8">
            <title>Xác Thực Email - Lỗi</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh;">
            <div style="max-width: 600px; background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center;">
              <div style="font-size: 50px; color: #e74c3c; margin-bottom: 20px;">❌</div>
              <h1 style="color: #333333; margin-bottom: 20px;">Xác Thực Email Thất Bại</h1>
              <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                Liên kết xác thực không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực hoặc liên hệ hỗ trợ.
              </p>
              <footer style="margin-top: 40px; color: #888888; font-size: 14px;">&copy; 2024 CookBook. Tất cả các quyền được bảo lưu.</footer>
            </div>
          </body>
        </html>
      `;
    }
  
    user.isActive = true;
    user.verificationToken = null;
    await this.usersRepository.save(user);
  
    return `
      <!DOCTYPE html>
      <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <title>Xác Thực Email Thành Công</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh;">
          <div style="max-width: 600px; background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center;">
            <div style="font-size: 50px; color: #28a745; margin-bottom: 20px;">✅</div>
            <h1 style="color: #333333; margin-bottom: 20px;">🎉 Email Xác Thực Thành Công!</h1>
            <p style="color: #555555; font-size: 16px; line-height: 1.6;">
              <strong>Username:</strong> ${user.username}<br>
              <strong>Email:</strong> ${user.email}
            </p>
            <p style="color: #555555; font-size: 16px; line-height: 1.6;">
              Cảm ơn bạn đã xác thực email của mình. Bây giờ bạn có thể truy cập đầy đủ các tính năng của CookBook và bắt đầu khám phá những công thức nấu ăn tuyệt vời!
            </p>
            <a href="https://www.cookbook.com" style="display: inline-block; padding: 12px 24px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; margin-top: 30px;">Về Trang Chủ</a>
            <footer style="margin-top: 40px; color: #888888; font-size: 14px;">&copy; 2024 CookBook. Tất cả các quyền được bảo lưu.</footer>
          </div>
        </body>
      </html>
    `;
  }
  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu cũ không chính xác.');
    }
    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.usersRepository.save(user);
    return { message: 'Đổi mật khẩu thành công.' };
  }
  
  async forgotPassword(forgotDto: ForgotDto): Promise<any> {
    const { email } = forgotDto;
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      user.resetPasswordCode = Math.floor(100000 + Math.random() * 900000).toString();
      await this.usersRepository.save(user);

      // Gửi email reset mật khẩu
      await this.mailerService.sendResetPasswordEmail(user.name, user.email, user.resetPasswordCode);
    }

    return { message: 'Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi.' };
  }
  

  async resetPasswordCode(resetPassword1Dto: ResetPassword1Dto): Promise<any> {
    const { email, code } = resetPassword1Dto;

    const user = await this.usersRepository.findOne({ where: { email: email } });
    if(user.resetPasswordCode === null){
      throw new BadRequestException('Mã xác nhận đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới.');
    }
    if(user.resetPasswordCode !== code){
      throw new BadRequestException('Mã xác nhận không đúng.');
    }

    user.verificationToken = uuidv4();
    user.resetPasswordCode = null;
    await this.usersRepository.save(user);
    return { token: user.verificationToken, message: 'Mã xác nhận đúng. Bạn có thể đặt lại mật khẩu.' };
  }
  async resetPassword(resetPassword2Dto: ResetPassword2Dto): Promise<any> {
    const { email, token, password } = resetPassword2Dto;

    const user = await this.usersRepository.findOne({ where: { email: email } });
    if(user.verificationToken === null){
      throw new BadRequestException('Mã xác nhận đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới.');
    }
    if(user.verificationToken !== token){
      throw new BadRequestException('Mã xác nhận không đúng.');
    }

    user.password = await bcrypt.hash(password, 10);
    user.verificationToken = null;
    await this.usersRepository.save(user);
    return { message: 'Đặt lại mật khẩu thành công.' };
  }
  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<any> {
    let profile = await this.usersRepository.findOne({ where: { id: userId } });
    if (!profile) {
      return { message: 'Không tìm thấy profile.' };
    }
    Object.assign(profile, updateProfileDto);
    await this.usersRepository.save(profile);
    return { message: 'Cập nhật hồ sơ thành công.', profile };
  }
  async getProfileByUserId(userId: number): Promise<any> {
    const profile = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followers', 'following'],
    });
    if (!profile) {
      throw new NotFoundException('Hồ sơ không tồn tại.');
    }
    const totalFollowers = profile.followers.length;
    const totalFollowing = profile.following.length;

    const { id, bio, name, avatar, banner } = profile;
    
    return { userId: id, bio, name, avatar, banner, totalFollowers, totalFollowing };

  }
  async searchUserByUsername(username: string, page: number): Promise<any> {
    const users = await this.usersRepository.find
    ({
      where: {
        username: Like(`%${username}%`)
      },
      relations: ['followers', 'following'],
    })
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    if (users.length > itemsPerPage*page) {
      return {nextPage: true, users: users.slice(startIndex, startIndex + itemsPerPage).map(user => new ReponseUserProfileDto(user, user.followers.length, user.following.length))};
    }
    else{
      return {nextPage: false, users: users.slice(startIndex, startIndex + itemsPerPage).map(user => new ReponseUserProfileDto(user, user.followers.length, user.following.length))};
    }
  }
  async searchUserByName(name: string, page: number): Promise<any> {
    const users = await this.usersRepository.find
    ({
      where: {
        name: Like(`%${name}%`)
      },
      relations: ['followers', 'following'],
    })
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    if (users.length > itemsPerPage*page) {
      return {nextPage: true, users: users.slice(startIndex, startIndex + itemsPerPage).map(user => new ReponseUserProfileDto(user, user.followers.length, user.following.length))};
    }
    else{
      return {nextPage: false, users: users.slice(startIndex, startIndex + itemsPerPage).map(user => new ReponseUserProfileDto(user, user.followers.length, user.following.length))};
    }
  }
  async addToFavorites(postId: any, userId: number): Promise<any> {
    const user = await this.usersRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.favorites', 'favorites')
      .where('user.id = :userId', { userId })
      .select(['user.id', 'favorites.id'])
      .getOne();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const post = await this.postsRepository.findOne({
      where: { id: postId }
    });
    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại.');
    }
    
    const favoritePostIds = user.favorites.map((fav) => fav.id);
    if (favoritePostIds.some((fav) => fav == postId)) {
      throw new BadRequestException('Bài viết đã có trong danh sách yêu thích.');
    }
    
    user.favorites.push(post);
    await this.usersRepository.save(user);
    return { message: 'Đã thêm bài viết vào danh sách yêu thích.'};
  
  }

  async deleteFromFavorites(postId: number, userId: number): Promise<any> {
    const user = await this.usersRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.favorites', 'favorites')
      .where('user.id = :userId', { userId })
      .select(['user.id', 'favorites.id'])
      .getOne();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const favoriteIndex = user.favorites.findIndex((fav) => fav.id == postId);

    if (favoriteIndex == -1) {
      throw new NotFoundException('Bài viết không nằm trong danh sách yêu thích của bạn.');
    }
    user.favorites.splice(favoriteIndex, 1);

    await this.usersRepository.save(user);
    return { message: 'Đã xóa bài viết khỏi danh sách yêu thích.' };
  }

  async getFavorites(page: number, userId: number): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const favorites = user.favorites;

    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    if (favorites.length > itemsPerPage*page) {
      return {nextPage: true, favorites: favorites.slice(startIndex, startIndex + itemsPerPage).map(fav => new LiteReponsePostDto(fav))};
    }
    else{
      return {nextPage: false, favorites: favorites.slice(startIndex, startIndex + itemsPerPage).map(fav => new LiteReponsePostDto(fav))};
    }
  }
  async checkFavorite(postId: number, userId: number): Promise<any> {
    const user = await this.usersRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.favorites', 'favorites')
      .where('user.id = :userId', { userId })
      .select(['user.id', 'favorites.id'])
      .getOne();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const favoritePostIds = user.favorites.map((fav) => fav.id);
    if (favoritePostIds.some((fav) => fav == postId)) {
      return { isFavorited: true };
    }
    return { isFavorited: false };

  }
  async setTokenFCM(tokenDto: TokenDto, userId: number): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.tokenFCM = tokenDto.token;
    await this.usersRepository.save(user);
    return { message: 'Đã cập nhật tokenFCM.' };
  }
  async logout(userId: number): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.tokenFCM = null;
    await this.usersRepository.save(user);
    return { message: 'Đã đăng xuất.' };
  }
  /*
  async uploadImage(file: Express.Multer.File): Promise<any> {
    try {
      if(!file) return {error: "No file uploaded"}
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'uploads',
      });
      console.log(result.secure_url);
      return result.secure_url;

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to upload image');
    }
  }
    */
  async uploadImage(buffer: Buffer): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);
        
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'uploads' },
          (error, result) => {
            if (error) {
              reject(new InternalServerErrorException('Failed to upload image to Cloudinary'));
            }
            console.log({imageURL: result.secure_url})
            resolve(
              {imageURL: result.secure_url}
            );
          }
        );

        readable.pipe(uploadStream);
      });

    } catch (error) {
      throw new InternalServerErrorException('Failed to upload image');
    }
  }
  async sendImageToAI(buffer: Buffer): Promise<any> {
    try{
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      
      const genAI = new GoogleGenerativeAI("AIzaSyBEEXfHU_NM0mQUIrqitWBcc-JzIR-3ccw");
      function fileToGenerativePart(buf, mimeType) {
        return {
          inlineData: {
            data: buf.toString("base64"),
            mimeType
          },
        };
      }
      const imageParts = [
        fileToGenerativePart(buffer, "image/jpeg")
      ]
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const generationConfig = {
        temperature: 0.1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          description: "Danh sách nguyên liệu phân tích được từ trong ảnh và tên các món ăn chế biến được chỉ với những nguyên liệu đó",
          properties: {
            ingredients: {
              type: "array",
              description: "Danh sách nguyên liệu phân tích được từ trong ảnh",
              items: {
                type: "object",
                description: "Nguyên liệu phân tích được từ trong ảnh",
                properties: {
                  name: {
                    type: "string",
                    description: "Tên nguyên liệu"
                  },
                  quantity: {
                    type: "string",
                    description: "Số lượng nguyên liệu"
                  }
                },
                required: [
                  "name",
                  "quantity"
                ]
              }
            },
            recipes: {
              type: "array",
              description: "Danh sách món ăn chế biến được chỉ với những nguyên liệu có sẵn, không cần chuẩn bị thêm",
              items: {
                type: "string",
                description: "Tên món ăn"
              }
            }
          },
          required: [
            "ingredients",
            "recipes"
          ]
        },
      };
      const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
      });
      const prompt = 
`
Bạn là trợ lý AI chuyên phân tích nguyên liệu và nấu ăn. Tôi sẽ gửi cho bạn một hình ảnh là các nguyên liệu nấu ăn, tôi cần bạn phân tích hình ảnh đó và tìm những món ăn nấu được ngay từ những nguyên liệu đó mà không cần mua thêm. Khi nhận hình ảnh nguyên liệu, bạn phải phân tích và liệt kê chính xác các nguyên liệu có trong ảnh (bao gồm số lượng cụ thể như "1kg", "2 thìa canh", "3 quả").
Sau đó hãy tạo ra 3-6 món ăn nấu được luôn với những nguyên liệu đã có, không cần chuẩn bị thêm, chỉ dùng những nguyên liệu đã có để tạo món ăn, không tạo những món ăn mà thiếu nguyên liệ.
Mỗi món ăn tạo ra phải thật hợp lý, thực tế, ăn được. Chỉ dùng những nguyên liệu đã có để tạo món ăn, không tạo những món ăn mà thiếu nguyên liệu.
Kết quả trả về là tiếng việt.
`
      
      //const result = await model.generateContent([prompt, ...imageParts]);
      const result = await chatSession.sendMessage([prompt, ...imageParts]);

      const data = result.response.text();
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to analyze image');
    }

  }
  async getRecipesByIngredients(getRecipeDto: GetRecipeDto ): Promise<any> {
    try{
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      
      const genAI = new GoogleGenerativeAI("AIzaSyBEEXfHU_NM0mQUIrqitWBcc-JzIR-3ccw");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const generationConfig = {
        temperature: 1,
        topP: 0.5,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            recipes: {
              type: "array",
              description: "Danh sách công thức nấu ăn",
              items: {
                type: "object",
                description: "Công thức nấu ăn",
                properties: {
                  name: {
                    type: "string",
                    description: "Tên món ăn, phải thật lém lỉnh, hài hước, thú vị"
                  },
                  ingredients: {
                    type: "array",
                    description: "Danh sách nguyên liệu, số lượng nguyên liệu cần chế biến món ăn",
                    items: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                          description: "Tên nguyên liệu"
                        },
                        quantity: {
                          type: "string",
                          description: "Số lượng nguyên liệu"
                        }
                      },
                      required: [
                        "name",
                        "quantity"
                      ]
                    }
                  },
                  steps: {
                    type: "array",
                    description: "Danh sách các bước nấu ăn, hướng dẫn cách chế biến món ăn",
                    items: {
                      type: "string",
                      description: "Bước nấu ăn, phải thật lém lỉnh, hài hước, thú vị"
                    }
                  }
                },
                required: [
                  "name",
                  "ingredients",
                  "steps"
                ]
              }
            }
          },
          required: [
            "recipes"
          ]
        },
      };
      
      const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
      });
      const prompt = 
`
Nhập vai thành một đầu bếp chuyên nghiệp, hãy giúp tôi xây dựng các công thức nấu ăn chỉ với những nguyên liệu của tôi, không được sử dụng thêm nguyên liệu nào khác.
Các món ăn phải thực tế, có thật, ăn được.
Dưới đây là danh sách nguyên liệu của tôi:
${JSON.stringify(getRecipeDto.ingredients, null, 2)}
Chỉ được sử dụng những nguyên liệu trên, tạo cho tôi những nguyên liệu và các bước để nấu từng món ăn sau:
${JSON.stringify(getRecipeDto.recipes, null, 2)}
Các bước nấu ăn phải đủ: sơ chế nguyên liệu, chế biến món ăn, trình bày món ăn.
Các bước hướng dẫn phải thật hài hước, thú vị, lém lỉnh, bắt chước cách nói chuyện hài hước của giới trẻ, bắt chước cách sử dụng những từ ngữ trending, những từ giới trẻ hay dùng. 
Pha các trò đùa, câu chuyện, tình huống hài hước vào bước chế biến món ăn.
Có thể ẩn dụ trêu đùa (nội dung người lớn nhưng tế nhị).

`
      //const result = await model.generateContent([prompt, ...imageParts]); 

      let result: any;
      if(getRecipeDto.note){
        const note = 
`
Ghi chú cho món ăn:
${JSON.stringify(getRecipeDto.note, null, 2)}
`
        result = await chatSession.sendMessage([prompt,...note]);
      }
      else 
      {
        result = await chatSession.sendMessage(prompt);
      }
      const data = result.response.text();
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (error) {
      throw new Error('Failed get recipes by ingredients');
    }
  }
}

