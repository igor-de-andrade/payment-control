const { GraphQLError } = require('graphql');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const COMPETENCIA_REGEX = /^(0[1-9]|1[0-2])\/\d{4}$/;
const CPF_REGEX = /^\d{11}$/;

function badRequest(message) {
  return new GraphQLError(message, { extensions: { code: 'BAD_USER_INPUT' } });
}

function validateEmail(email) {
  if (!EMAIL_REGEX.test(email || '')) throw badRequest('E-mail inválido.');
}

function validateDate(value, field, required = true) {
  if (!value && !required) return;
  const parsed = new Date(`${value}T00:00:00Z`);
  if (!DATE_REGEX.test(value || '') || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw badRequest(`${field} deve estar no formato YYYY-MM-DD e ser uma data válida.`);
  }
}

function validateCompetencia(value) {
  if (!COMPETENCIA_REGEX.test(value || '')) throw badRequest('Competência deve estar no formato MM/YYYY.');
}

function validateCpf(cpf) {
  const value = (cpf || '').trim();
  if (!CPF_REGEX.test(value) || /^(\d)\1{10}$/.test(value)) throw badRequest('CPF inválido.');
}

module.exports = { badRequest, validateEmail, validateDate, validateCompetencia, validateCpf };
