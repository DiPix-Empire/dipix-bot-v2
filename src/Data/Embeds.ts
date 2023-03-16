import { Colors, EmbedBuilder } from "discord.js";
export const footer = { text: `DiPix Bot © Philainel, 2022-2023` }
export const ErrorEmbed = (comment = "Произошла непредвиденная ошибка.") => new EmbedBuilder()
	.setColor('#c62828')
	.setTitle('Ошибка!')
	.setDescription(comment)
	.setTimestamp(Date.now())
	.setFooter(footer)
export const SuccesfulEmbed = (comment = "Команда успешно выполнено.") => new EmbedBuilder()
	.setColor('#3ba55d')
	.setTitle('Успешно!')
	.setDescription(comment)
	.setTimestamp(Date.now())
	.setFooter(footer)
export const ProcessingEmbed = (comment = "Действие выполняется...") => new EmbedBuilder()
	.setColor(Colors.Yellow)
	.setTitle("Выполняется...")
	.setDescription(comment)
	.setTimestamp(Date.now())
	.setFooter(footer)
export const WarnEmbed = (comment: string) => new EmbedBuilder()
	.setTitle("Внимание!")
	.setDescription(comment)
	.setColor(Colors.Yellow)
	.setTimestamp(Date.now())
	.setFooter(footer)
export const InfoEmbed = (title: string, comment = "") => {
	let res = new EmbedBuilder()
	.setColor(Colors.DarkGrey)
	.setTitle(title)
	.setTimestamp(Date.now())
	.setFooter(footer)
	comment && res.setDescription(comment)
	return res
}
