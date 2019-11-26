import { Command, Arguments, Server } from "../../definitions";
import { Message } from "discord.js";
import { Bank } from "../../Cassino";

export default <Command>{
    run: (msg: Message, args: Arguments): void => {
        Bank.jsonOpen();
        const list = [...Bank.json.users];
        Bank.jsonClose();

        list.sort((a, b) => b.money - a.money);

        let text = "Rank de usuários (ordem: Nível de Burguesia):\n```";
        list.forEach((u, index) => {
            if (index >= 10) return;
            const member = msg.guild.members.find(a => a.id === u.userid);
            text += `${index + 1 + 'º' + (index === 9 ? ' ' : '  ')}- ${member.user.tag}\n`;
        });
        text += "```";
        msg.channel.send(text);
    },
    staff: false,
    aliases: ["rank"],
    shortHelp: "Veja quais são os maiores burgueses do servidor",
    longHelp: "Saiba qual é o rank das pessoas mais ricas do servidor",
    example: `${Server.prefix}rank`
};