/**
 * Formata um nome completo para gerar diferentes variações úteis, como nome abreviado,
 * nome completo com iniciais intermediárias e combinação do primeiro com o último nome.
 *
 * Exemplo de uso:
 * - Entrada: "Jon Doe Silva"
 * - Saídas:
 *   - name: "Jon Doe"
 *   - name_full: "Jon Doe Silva"
 *   - name_full_abbrev: "Jon D Silva"
 *   - first_last: "Jon Silva"
 *   - middle_abbrev: "D"
 *
 * @param fullname - O nome completo a ser formatado.
 * @returns Um objeto contendo variações do nome formatado:
 * - `name`: Primeiro nome e segundo nome (ou apenas o primeiro, se não houver segundo).
 * - `name_full`: Nome completo formatado com a capitalização correta.
 * - `name_full_abbrev`: Nome completo com os nomes intermediários abreviados.
 * - `first_last`: Combinação do primeiro e último nome.
 * - `middle_abbrev`: Iniciais dos nomes intermediários (sem pontuação).
 */
export function formatName(fullname: string) {
  const parts = fullname
    .trim()
    .split(/\s+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());

  if (parts.length === 0) {
    return {
      name: '',
      name_full: '',
      name_full_abbrev: '',
      first_last: '',
      middle_abbrev: '',
    };
  }

  const first = parts[0];
  const second = parts[1] || '';
  const last = parts[parts.length - 1];
  const middle = parts.slice(2, parts.length - 1);

  const name = [first, second].filter(Boolean).join(' ').trim();
  const middle_abbrev = middle.map((m) => m.charAt(0)).join(' ');

  const name_full = [first, second, ...middle, last].filter(Boolean).join(' ');
  const name_full_abbrev = [
    first,
    second.charAt(0),
    ...middle_abbrev.split(' '),
    last,
  ]
    .filter(Boolean)
    .join(' ');

  const first_last = `${first} ${last}`;

  return {
    name,
    name_full,
    name_full_abbrev,
    first_last,
    middle_abbrev,
  };
}
