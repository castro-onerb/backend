import { existsSync, copyFileSync, readFileSync, writeFileSync } from 'fs';
import { execSync } from 'node:child_process';
import { unlinkSync } from 'node:fs';
import * as path from 'path';

const ENV_PATH = path.resolve('.env');
const ENV_EXAMPLE_PATH = path.resolve('.env.example');

function normalizeBase64(filePath: string): string {
  return readFileSync(filePath, 'utf-8').replace(/\r?\n/g, '');
}

function deleteFiles(files: string[]) {
  for (const file of files) {
    if (existsSync(file)) {
      unlinkSync(file);
      console.log(`🧹 Arquivo removido: ${file}`);
    }
  }
}

try {
  console.log('📦 Instalando dependências...');
  execSync('npm install', { stdio: 'inherit' });

  execSync(
    'openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048',
    { stdio: 'inherit' },
  );
  execSync('openssl rsa -pubout -in private.key -out public.key', {
    stdio: 'inherit',
  });

  execSync('base64 private.key > private.b64', { stdio: 'inherit' });
  execSync('base64 public.key > public.b64', { stdio: 'inherit' });

  if (!existsSync(ENV_PATH)) {
    console.log(
      '\n📝 Arquivo .env não encontrado. Criando a partir de .env.example...',
    );
    copyFileSync(ENV_EXAMPLE_PATH, ENV_PATH);
  }

  const jwtSecretKey = normalizeBase64('private.b64');
  const jwtPublicKey = normalizeBase64('public.b64');

  let envContent = readFileSync(ENV_PATH, 'utf-8');

  const setEnvVar = (key: string, value: string) => {
    const quotedValue = `"${value}"`;
    const regex = new RegExp(`^${key}=.*`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${quotedValue}`);
    } else {
      envContent += `\n${key}=${quotedValue}`;
    }
  };

  setEnvVar('JWT_SECRET_KEY', jwtSecretKey);
  setEnvVar('JWT_PUBLIC_KEY', jwtPublicKey);

  writeFileSync(ENV_PATH, envContent);

  deleteFiles(['private.b64', 'public.b64']);

  console.log('\n✅ Inicialização completa com sucesso!');
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error('\n❌ Erro durante inicialização:', error.message);
  } else {
    console.error('\n❌ Erro inesperado:', error);
  }
  process.exit(1);
}
