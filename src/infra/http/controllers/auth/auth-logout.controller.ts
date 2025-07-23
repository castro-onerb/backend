import { Controller, Post, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthLogoutController {
  @Post('me/logout')
  @ApiOperation({
    summary: 'Encerra sessão do usuário',
    description:
      'O endpoint captura os tokens e limpa-os do ambiente do usuário.',
  })
  @ApiOkResponse({
    description: 'Sessão do usuário finalizada',
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
