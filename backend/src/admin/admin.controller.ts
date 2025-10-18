import { IN_USE_ERROR, login, signup } from './auth.service';
import {
  Body,
  Controller,
  Post,
  Response,
  Route,
  Tags,
} from "tsoa";
import logger from '../core/logging/logger';
import { ClientSafeError } from '../core/error/error.types';

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminSignUpRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

@Route("admin")
@Tags("Admin")
export class AdminController extends Controller {
  /**
   * Admin login
   * @param requestBody Login credentials
   * @returns JWT token for authentication
   */
  @Post("login")
  @Response<string>(401, "Invalid credentials")
  public async login(
    @Body() requestBody: AdminLoginRequest
  ): Promise<LoginResponse> {
    const { email, password } = requestBody;
    const token = await login(email, password);

    if (!token) {
      this.setStatus(401);
      throw new ClientSafeError("Invalid username or password");
    }

    return { token };
  }

  /**
   * Admin signup
   * @param requestBody signup credentials
   */
  @Post("signup")
  @Response<string>(500, "Server error")
  public async signup(
    @Body() requestBody: AdminSignUpRequest
  ): Promise<void> {
    const { email, password } = requestBody;
    try {
      const result = await signup(email, password);
      if (!result) {
        this.setStatus(201);
        return;
      }
    } catch (error) {
      logger.error(`Error during signup for (${email}): ${error}`);
      this.setStatus(500);
      if (error === IN_USE_ERROR) {
        throw new ClientSafeError(IN_USE_ERROR);
      }
      throw new ClientSafeError("Something went wrong");
    }
  }
}