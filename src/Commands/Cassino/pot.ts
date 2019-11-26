import { Command, Arguments, Server } from "../../definitions";
import { Message } from "discord.js";
import { currentLoteria } from "../../Cassino/loteria";

export default <Command>{
    run: (msg: Message, args: Arguments) => {
        if (currentLoteria === -1) {
            msg.channel.send(`${msg.author} Não existe nenhuma loteria iniciada!`);
            return;
        }

        const result = currentLoteria.pot();
        msg.channel.send(`${msg.author} A quantidade de dinheiro acumulada é ${result}`);
    },
    staff: false,
    aliases: ["pot"],
    shortHelp: "Veja quanto dinheiro está acumulado numa loteria",
    longHelp: "Veja quanto dinheiro está acumulado numa loteria acontecendo agora",
    example: `${Server.prefix}pot`
};