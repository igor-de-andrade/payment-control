/** Banco em memória. Os dados são perdidos quando a aplicação reinicia. */
module.exports = {
  // Senha inicial: 123456 (armazenada exclusivamente como hash bcrypt).
  usuarios: [{
    id: '00000000-0000-4000-8000-000000000001',
    email: 'admin@admin.com',
    senha: '$2a$10$xtqV3Pqp1ZK.lrKv3i5Piee/mk4ajBGh0MPV/NR7m9GILQErHw5gW',
    nome: 'ADMIN',
    ativo: true
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    email: 'pgats@turma3.com',
    senha: '$2a$10$xtqV3Pqp1ZK.lrKv3i5Piee/mk4ajBGh0MPV/NR7m9GILQErHw5gW',
    nome: 'pgats',
    ativo: false
  }],
  funcionarios: [],
  processamentos: [],
  historicosFuncionarios: []
};
