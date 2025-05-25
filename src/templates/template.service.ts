import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import juice from 'juice';

export class TemplateService {
  static compileTemplate(
    templateName: string,
    context: Record<string, any>,
  ): string {
    const templatePath = path.resolve(
      'src',
      'templates',
      `${templateName}.hbs`,
    );
    const cssPath = path.resolve('src', 'templates', 'assets/css/style.css');

    const source = fs.readFileSync(templatePath, 'utf8');
    const sharedCss = fs.readFileSync(cssPath, 'utf8');

    const compiled = Handlebars.compile(source);
    const htmlWithoutCss = compiled(context);

    // Adiciona o CSS compartilhado no topo
    const htmlWithCss = `<style>${sharedCss}</style>\n${htmlWithoutCss}`;

    // Transforma tudo em CSS inline
    const inlined = juice(htmlWithCss);

    return inlined;
  }
}
