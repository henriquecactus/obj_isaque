import { Command, Arguments, Server, Channels, Permission } from "../../definitions";
import { Message } from "discord.js";
export default <Command>{
	run: (msg: Message, args: Arguments): void => {
		if (msg.channel.id !== Channels.shitpost) return;
		msg.channel.send(`Vincolan é 1${'0'.repeat(Math.floor(Math.random() * 191))}% bobão`);
	},
	permissions: Permission.Shitpost,
	aliases: ["vincolan", "bobao"],
	shortHelp: "Mostra quanto o vincolan é bobão atualmente",
	longHelp: "Envia uma mensagem mostrando quantos % o vincolan é bobão",
	example: `${Server.prefix}vincolan`
};
