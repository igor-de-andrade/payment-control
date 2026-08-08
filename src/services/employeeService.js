const { randomUUID } = require('crypto');
const { GraphQLError } = require('graphql');
const repository = require('../repositories/employeeRepository');
const { badRequest, validateDate, validateCpf } = require('../utils/validation');

function validate(input, partial = false) {
  if (!partial && (!input.cpf?.trim() || !input.nome?.trim() || input.salario_base == null || !input.admissao)) throw badRequest('CPF, nome, salário base e admissão são obrigatórios.');
  if (input.cpf !== undefined) validateCpf(input.cpf);
  if (input.salario_base !== undefined && input.salario_base < 0) throw badRequest('Salário base não pode ser negativo.');
  if (input.admissao !== undefined) validateDate(input.admissao, 'Admissão');
  if (input.desligamento !== undefined) validateDate(input.desligamento, 'Desligamento', false);
  const admissao = input.admissao;
  const desligamento = input.desligamento;
  if (admissao && desligamento && desligamento < admissao) throw badRequest('Desligamento não pode ser anterior à admissão.');
}
function create(input) {
  validate(input);
  if (repository.findByCpf(input.cpf.trim())) throw badRequest('Já existe funcionário com este CPF.');
  return repository.create({ id: randomUUID(), cpf: input.cpf.trim(), nome: input.nome.trim(), salario_base: input.salario_base, admissao: input.admissao, desligamento: input.desligamento || null });
}
function update(id, input) {
  const current = repository.findById(id);
  if (!current) throw new GraphQLError('Funcionário não encontrado.', { extensions: { code: 'NOT_FOUND' } });
  const merged = { ...current, ...input };
  validate(merged);
  if (input.cpf !== undefined) { const owner = repository.findByCpf(input.cpf.trim()); if (owner && owner.id !== id) throw badRequest('Já existe funcionário com este CPF.'); }
  const changes = { ...input };
  if (changes.cpf) changes.cpf = changes.cpf.trim();
  if (changes.nome) changes.nome = changes.nome.trim();
  if (changes.desligamento === '') changes.desligamento = null;
  return repository.update(id, changes);
}
function remove(id) { if (!repository.remove(id)) throw new GraphQLError('Funcionário não encontrado.', { extensions: { code: 'NOT_FOUND' } }); return true; }
module.exports = { create, update, remove, findAll: repository.findAll, findById: repository.findById };
