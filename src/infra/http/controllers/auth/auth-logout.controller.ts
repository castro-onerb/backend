import { Controller, Post, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthLogoutController {
  @Post('logout')
  @ApiOkResponse({
    description: 'Endpoint responsável por finalizar uma sessão',
    schema: {
      example: {
        message: 'Logout feito com sucesso.',
      },
    },
  })
  logout(@Res() res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });

    return res.status(200).json({ message: 'Logout feito com sucesso.' });
  }
}
