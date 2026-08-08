function gerarCpf() {
    const base = Array.from({ length: 9 }, () => Math.floor(Math.random() * 9))

    let digito1 = base.reduce((total, numero, indice) => total + numero * (10 - indice), 0)
    digito1 = 11 - (digito1 % 11)
    if (digito1 >= 10) digito1 = 0

    let digito2 = [...base, digito1].reduce((total, numero, indice) => total + numero * (11 - indice), 0)
    digito2 = 11 - (digito2 % 11)
    if (digito2 >= 10) digito2 = 0

    return [...base, digito1, digito2].join('')
}

module.exports = { gerarCpf }
