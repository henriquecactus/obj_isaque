"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Banco_1 = require("./Banco");
class Loteria {
    constructor(custo) {
        this.participantes = [];
        this.custo = custo;
    }
    /**
     * @returns {number} Retorna -1 se o usuário já tiver comprado algum bilhete, caso contrário retorna a quantidade de bilhetes compradas
     * @param {string} user
     * @param {number} qnt
     */
    bilhete(user, qnt) {
        if (this.participantes.some(a => a === user))
            return -1;
        Banco_1.Banco.jsonOpen();
        const userindex = Banco_1.Banco.json.users.findIndex(a => a.userid === user);
        let i;
        for (i = 0; i < qnt; i++) {
            if (Banco_1.Banco.json.users[userindex].money < this.custo)
                break;
            this.participantes.push(user);
            Banco_1.Banco.json.users[userindex].money -= this.custo;
        }
        Banco_1.Banco.jsonClose();
        return i;
    }
    /**
     * @returns {number} A quantidade de dinheiro já acumulada.
     */
    pot() {
        return this.participantes.length * this.custo;
    }
    /**
     * @returns {object} Retorna o ID do usuário vencedor e a quantidade de dinheiro obtida. {user: string, money: number}
     */
    resultado() {
        if (this.participantes.length === 0)
            return undefined;
        const result = Math.min(Math.floor(Math.random() * this.participantes.length), this.participantes.length - 1);
        const moneyWon = this.participantes.length * this.custo;
        Banco_1.Banco.jsonOpen();
        const ind = Banco_1.Banco.json.users.findIndex(a => a.userid === this.participantes[result]);
        Banco_1.Banco.json.users[ind].money += moneyWon;
        const toReturn = { user: this.participantes[result], money: moneyWon };
        Banco_1.Banco.jsonClose();
        return toReturn;
    }
}
exports.Loteria = Loteria;
