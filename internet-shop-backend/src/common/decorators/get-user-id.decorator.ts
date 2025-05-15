import { JwtPayload } from '@interfaces/jwt-payload.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type RequestParams = Record<string | symbol, any>;

export const GetUserId = createParamDecorator(
  (_: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestParams>();

    const user = (request?.user as JwtPayload) ?? undefined;

    if (!user) {
      throw new Error('User not found');
    }

    return user.sub;
  },
);
