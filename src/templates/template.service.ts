import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

export class TemplateService {
  static compileTemplate(
    templateName: string,
    context: Record<string, any>,
  ): string {
    const filePath = path.resolve('src', 'templates', `${templateName}.hbs`);
    const source = fs.readFileSync(filePath, 'utf8');
    const template = Handlebars.compile(source);
    return template(context);
  }
}
