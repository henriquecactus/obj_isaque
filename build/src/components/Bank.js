"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discordServer = __importStar(require("../constants"));
const Moderation_1 = __importDefault(require("./Moderation"));
const Cassino_1 = require("./Cassino");
class Bank {
    /* Corrida de Cavalos */
    // !!corrida maxParticipantes tempoParaComeçar duração aposta
    corrida(msg, args) {
        if (!Moderation_1.default.isAdmin(msg.author))
            return;
        if (args.length < 5) {
            msg.channel.send(`${msg.author} Sintaxe inválida!`);
            return;
        }
        if (Bank.corridaCurrent) {
            msg.channel.send(`${msg.author} Já existe uma corrida rolando!`);
            return;
        }
        const maxUsers = Number(args[1]);
        if (maxUsers === NaN) {
            msg.channel.send(`${msg.author} Quantidade máxima de participantes inválida!`);
            return;
        }
        const timeToRun = Number(args[2]);
        if (timeToRun === NaN || timeToRun < 10) {
            msg.channel.send(`${msg.author} Tempo para começar inválido!`);
            return;
        }
        const duration = Number(args[3]);
        if (duration === NaN || duration < 5) {
            msg.channel.send(`${msg.author} Duração inválida!`);
            return;
        }
        const cost = Number(args[4]);
        if (cost === NaN || cost < 10) {
            msg.channel.send(`${msg.author} Aposta inválida!`);
            return;
        }
        Cassino_1.CorridaDeCavalo(msg, maxUsers, timeToRun, duration, cost);
    }
    /* REGISTER */
    register(msg) {
        const result = Cassino_1.Banco.register(msg.author.id);
        if (result) {
            msg.channel.send(`${msg.author} Você foi registrado com sucesso!`);
        }
        else {
            msg.channel.send(`${msg.author} Você já está registrado!`);
        }
    }
    /* SEMANAL */
    semanal(msg) {
        const result = Cassino_1.Banco.weekMoney(msg.author.id);
        if (result === 0) {
            msg.channel.send(`${msg.author} Você não está registrado!`);
        }
        else if (result < 0) {
            msg.channel.send(`${msg.author} Você ainda não pode resgatar o prêmio semanal! Ainda faltam ${Bank.formatDate(-result)}.`);
        }
        else {
            msg.channel.send(`${msg.author} Você resgatou \`$${result}\``);
        }
    }
    /* ON USER MESSAGE */
    static onUserMessage(msg) {
        let chn = msg.channel;
        if (chn.name === discordServer.shitpostChannel)
            return;
        const result = Cassino_1.Banco.userMessage(msg.author.id);
        if (result > 0) {
            msg.guild.channels.find(a => a.name === discordServer.shitpostChannel).send(`${msg.author} Parabéns! Você ganhou \`$${result}\``);
        }
    }
    /* PUNISHMENT */
    punish(msg, args) {
        if (!Moderation_1.default.isAdmin(msg.author))
            return;
        if (args.length < 3) {
            msg.channel.send(`${msg.author} Informe o usuário que deseja punir e quanto deseja descontar dele.`);
            return;
        }
        const qnt = Number(args[1]);
        if (isNaN(qnt) || qnt !== Math.trunc(qnt)) {
            msg.channel.send(`${msg.author} Quantidade inválida.`);
            return;
        }
        msg.mentions.members.forEach(m => {
            if (Moderation_1.default.isAdmin(m.user))
                return;
            const result = Cassino_1.Banco.userPunish(m.id, qnt);
            if (result) {
                msg.channel.send(`${msg.author} O usuário ${m.user.tag} foi punido com sucesso.`);
            }
            else {
                msg.channel.send(`${msg.author} Não foi possível punir o usuário ${m.user.tag}. Talvez ele não esteja registrado ainda!`);
            }
        });
    }
    /* LOTERIA */
    loteria(msg, args) {
        if (!Moderation_1.default.isAdmin(msg.author))
            return;
        if (Bank.loteriaCurrent !== -1) {
            msg.channel.send(`${msg.author} Já existe uma loteria rolando!`);
            return;
        }
        if (args.length < 2) {
            msg.channel.send(`${msg.author} Informe quanto custará cada bilhete da loteria!`);
            return;
        }
        const preco = Number(args[1]);
        if (isNaN(preco) || preco <= 0 || preco !== Math.trunc(preco)) {
            msg.channel.send(`${msg.author} Preço dos bilhetes inválido!`);
            return;
        }
        Bank.loteriaCurrent = new Cassino_1.Loteria(Number(args[1]));
        msg.channel.send(`${msg.author} Loteria iniciada!`);
    }
    /* BILHETE */
    bilhete(msg, args) {
        if (Bank.loteriaCurrent === -1) {
            msg.channel.send(`${msg.author} Não existe nenhuma loteria iniciada!`);
            return;
        }
        if (args.length < 2) {
            msg.channel.send(`${msg.author} Informe quantos bilhetes deseja comprar. Esta é uma compra única!`);
            return;
        }
        const qnt = Number(args[1]);
        if (isNaN(qnt) || qnt <= 0 || qnt !== Math.trunc(qnt)) {
            msg.channel.send(`${msg.author} Quantidade de bilhetes inválida.`);
            return;
        }
        const result = typeof Bank.loteriaCurrent !== 'number' ? Bank.loteriaCurrent.bilhete(msg.author.id, qnt) : 0;
        if (result < 0) {
            msg.channel.send(`${msg.author} Você não está registrado ou já usou o \`${discordServer.prefix}bilhete\` antes!`);
        }
        else if (result === 0) {
            msg.channel.send(`${msg.author} Infelizmente você não pôde comprar nenhum bilhete. <:Zgatotristepo:589449862697975868>`);
        }
        else if (result < qnt) {
            msg.channel.send(`${msg.author} Infelizmente você não havia dinheiro suficiente para comprar esta quantidade de bilhetes. Então você acabou comprando somente ${result}.`);
        }
        else {
            msg.channel.send(`${msg.author} Você comprou ${qnt} bilhete(s). Boa sorte!`);
        }
    }
    /* RESULTADO */
    resultado(msg) {
        if (!Moderation_1.default.isAdmin(msg.author))
            return;
        if (Bank.loteriaCurrent === -1) {
            msg.channel.send(`${msg.author} Não existe nenhuma loteria iniciada!`);
            return;
        }
        const result = typeof Bank.loteriaCurrent !== 'number' ? Bank.loteriaCurrent.resultado() : { money: 0, user: "" };
        if (result === undefined) {
            msg.channel.send(`${msg.author} Loteria encerrada com 0 participantes!`);
            return;
        }
        msg.channel.send(`Parabéns, <@${result.user}>! Você acaba de ganhar \`$${result.money}\`!`);
        msg.channel.send(`Obrigado a todos os outros membros que participaram dessa loteria! Boa sorte na próxima para os outros participantes.`);
        Bank.loteriaCurrent = -1;
    }
    pot(msg) {
        if (Bank.loteriaCurrent === -1) {
            msg.channel.send(`${msg.author} Não existe nenhuma loteria iniciada!`);
            return;
        }
        const result = typeof Bank.loteriaCurrent !== 'number' ? Bank.loteriaCurrent.pot() : { money: 0 };
        msg.channel.send(`${msg.author} A quantidade de dinheiro acumulada é ${result}`);
    }
    /* SALDO */
    saldo(msg, args) {
        if (args.length < 2) {
            const saldo = Cassino_1.Banco.saldo(msg.author.id);
            if (saldo === -1) {
                msg.channel.send(`${msg.author} Você não está registrado!`);
                return;
            }
            msg.channel.send(`${msg.author} Seu saldo é \`$${saldo}\``);
        }
        else {
            const m = msg.mentions.members.first();
            if (m === undefined) {
                msg.channel.send(`${msg.author} Usuário inválido.`);
                return;
            }
            const saldo = Cassino_1.Banco.saldo(m.id);
            if (saldo === -1) {
                msg.channel.send(`${msg.author} Este usuário não está registrado!`);
                return;
            }
            msg.channel.send(`${msg.author} O saldo do(a) ${m.user.tag} é \`$${saldo}\``);
        }
    }
    /* TRANSFER */
    transfer(msg, args) {
        if (args.length < 3) {
            msg.channel.send(`${msg.author} Sintaxe inválida. Consulte o \`!!help\`.`);
            return;
        }
        const member = msg.mentions.members.first();
        if (member === undefined) {
            msg.channel.send(`${msg.author} Usuário inválido.`);
            return;
        }
        const qnt = Number(args[1]);
        if (isNaN(qnt) || qnt <= 0 || qnt !== Math.trunc(qnt)) {
            msg.channel.send(`${msg.author} Valor inválido.`);
            return;
        }
        if (member.id === msg.author.id) {
            msg.channel.send(`${msg.author} Você tem algum problema por acaso?`);
            return;
        }
        const result = Cassino_1.Banco.transfer(msg.author.id, member.id, qnt);
        switch (result) {
            case -2:
                msg.channel.send(`${msg.author} Usuário inválido.`);
                break;
            case -1:
                msg.channel.send(`${msg.author} Você não está registrado!`);
                break;
            case 0:
                msg.channel.send(`${msg.author} Você não tem dinheiro o suficiente!`);
                break;
            case 1:
                msg.channel.send(`${msg.author} Você transferiu \`${qnt}\` para ${member.user.tag}!`);
                break;
        }
    }
    /* MESSAGES */
    messages(msg, args) {
        if (args.length < 2) {
            const qnt = 100 - Cassino_1.Banco.messages(msg.author.id);
            msg.channel.send(`${msg.author} Faltam exatamente ${qnt} mensagens até o seu próximo prêmio.`);
        }
        else {
            const user = msg.mentions.members.first();
            const qnt = 100 - Cassino_1.Banco.messages(user.id);
            msg.channel.send(`${msg.author} Faltam exatamente ${qnt} mensagens até o próximo prêmio do(a) ${user.user.tag}.`);
        }
    }
    /* SORTEIO */
    sorteio(msg, args) {
        if (!Moderation_1.default.isAdmin(msg.author))
            return;
        if (Bank.sorteioCurrent !== -1) {
            msg.channel.send(`${msg.author} Já existe um sorteio rolando!`);
            return;
        }
        if (args.length < 3) {
            msg.channel.send(`${msg.author} É necessário dizer quanto dinheiro será sorteado e quanto tempo durará (em segundos) este sorteio!`);
            return;
        }
        const qnt = Number(args[1]);
        if (isNaN(qnt) || qnt <= 0 || qnt !== Math.trunc(qnt)) {
            msg.channel.send(`${msg.author} Quantidade inválida.`);
            return;
        }
        const time = Number(args[2]) * 1000;
        if (isNaN(time) || time <= 0 || time !== Math.trunc(time)) {
            msg.channel.send(`${msg.author} Duração inválida.`);
            return;
        }
        Bank.sorteioCurrent = new Cassino_1.Sorteio(msg, qnt, time);
    }
    /* RANK */
    rank(msg) {
        Cassino_1.Banco.jsonOpen();
        const list = [...Cassino_1.Banco.json.users];
        Cassino_1.Banco.jsonClose();
        list.sort((a, b) => b.money - a.money);
        let text = "Rank de usuários (ordem: Nível de Burguesia):\n```";
        list.forEach((u, index) => {
            if (index >= 10)
                return;
            const member = msg.guild.members.find(a => a.id === u.userid);
            text += `${index + 1 + 'º' + (index === 9 ? ' ' : '  ')}- ${member.user.tag}\n`;
        });
        text += "```";
        msg.channel.send(text);
    }
    mendigar(msg) {
        const result = Cassino_1.Banco.mendigar(msg.author.id);
        if (result === null) {
            msg.channel.send(`${msg.author} Você não está registrado.`);
        }
        else if (result < 0) {
            msg.channel.send(`${msg.author} Você só poderá mendigar de novo depois de ${Bank.formatDate(-result)}!`);
        }
        else if (result === 0) {
            msg.channel.send(`${msg.author} Infelizmente ninguém quis te doar nada.`);
        }
        else {
            msg.channel.send(`${msg.author} Parabéns! Alguém te doou \`$${result}\`!`);
        }
    }
    /* FORMAT DATE */
    static formatDate(ms) {
        let str = [];
        switch (true) {
            case ms > discordServer.timing.week:
                const weeks = Math.trunc(ms / discordServer.timing.week);
                ms = ms % discordServer.timing.week;
                str.push(`${weeks} semana${weeks > 1 ? 's' : ''}`);
            case ms > discordServer.timing.day:
                const days = Math.trunc(ms / discordServer.timing.day);
                ms = ms % discordServer.timing.day;
                str.push(`${days} dia${days > 1 ? 's' : ''}`);
            case ms > discordServer.timing.hour:
                const hours = Math.trunc(ms / discordServer.timing.hour);
                ms = ms % discordServer.timing.hour;
                str.push(`${hours} hora${hours > 1 ? 's' : ''}`);
            case ms > discordServer.timing.minute:
                const minutes = Math.trunc(ms / discordServer.timing.minute);
                ms = ms % discordServer.timing.minute;
                str.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`);
            case ms > discordServer.timing.second:
                const seconds = Math.trunc(ms / discordServer.timing.second);
                ms = ms % discordServer.timing.second;
                str.push(`${seconds} segundo${seconds > 1 ? 's' : ''}`);
                break;
        }
        if (str.length === 0) {
            return "alguns instantes";
        }
        else if (str.length === 1) {
            return str[0];
        }
        let last = str[str.length - 1];
        str = str.slice(0, str.length - 1);
        let final = str.join(", ") + " e " + last;
        return final;
    }
    bingo(msg, args) {
        if (typeof (Bank.bingoCurrent) !== 'number') {
            Bank.bingoCurrent.checkWin = msg.author.id;
        }
        else {
            if (!Moderation_1.default.isAdmin(msg.author))
                return;
            if (args.length < 4) {
                msg.channel.send(`${msg.author} Sintaxe incorreta!`);
                return;
            }
            const timeToRun = Number(args[1]);
            if (timeToRun === NaN || timeToRun < 0) {
                msg.channel.send(`${msg.author} Tempo incorreto!`);
                return;
            }
            const size = Number(args[2]);
            if (size === NaN || size < 1) {
                msg.channel.send(`${msg.author} Tamanho da cartela incorreta!`);
                return;
            }
            const prize = Number(args[3]);
            if (prize === NaN || prize < 5) {
                msg.channel.send(`${msg.author} Valor do prêmio incorreto!`);
                return;
            }
            Bank.bingoCurrent = new Cassino_1.Bingo(msg, timeToRun, size, prize);
        }
    }
    normalizar(msg) {
        if (!Moderation_1.default.isAdmin(msg.author))
            return;
        Cassino_1.Banco.jsonOpen();
        Cassino_1.Banco.json.users = Cassino_1.Banco.json.users.map(user => { return { ...user, lastMedalha: Date.now(), medalha: 0 }; });
        Cassino_1.Banco.jsonClose();
    }
}
exports.default = Bank;
Bank.corridaCurrent = false;
Bank.loteriaCurrent = -1;
Bank.sorteioCurrent = -1;
Bank.bingoCurrent = -1;