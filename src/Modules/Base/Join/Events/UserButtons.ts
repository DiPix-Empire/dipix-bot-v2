import { Interaction, ButtonInteraction, ModalSubmitInteraction, TextChannel, EmbedBuilder } from "discord.js"
import App from "../../../../App"
import { ErrorEmbed, SuccesfulEmbed } from "../../../../Data/Embeds"
import Logger from "../../../../types/Logger"
import DiscordEvent from "../../../../types/ModuleEvent/DiscordEvent"
import { ButtonActionRowUser, ButtonActionRowAdmin } from "../Buttons"
import { ModalActionRowBiography } from "../Modals"
import Embed from "../Embed"

export default (app: App, logger: Logger, userBuffer: { [key: string]: Interaction }) => new DiscordEvent("interactionCreate", async (interaction: Interaction) => {
  if (!(interaction instanceof ButtonInteraction)) return
  if (!interaction.customId.startsWith("join:user:")) return
  try {
    let requestId = interaction.customId.split(":").pop()
    let request = await app.prisma.request.findUnique({
      where: { id: requestId }
    })
    if (request == null) throw new Error("Undefined request id")
    let textInput = JSON.parse(request.fields) as string[]
    let sex = textInput[2] || 'Не указан', promo = textInput[4] || 'Не указан'
    if (!userBuffer[`modal:${request.id}`]) return interaction.reply({ embeds: [ErrorEmbed("Ошибка буфера данных, перепишите заявку заново.")], ephemeral: true })
    logger.Debug("Interaction ID", interaction.customId)

    const embedTitle = ['Ваша заявка на присоединение', `Заявка: ${interaction.user.username}`]

    if (interaction.customId.startsWith(`join:user:send:`)) {
      await interaction.reply({ embeds: [SuccesfulEmbed("Заявка отправлена!")], ephemeral: true })
      await (userBuffer[`modal:${request.id}`] as ModalSubmitInteraction).editReply({ embeds: [Embed(sex, promo, textInput, embedTitle[0], interaction)], components: [ButtonActionRowUser(request.id, true, true)] });
      let msg = await (
        (await app.bot.channels.fetch(app.config.modules.join.channels.panel)) as TextChannel)
        .send({ 
          content: `<${app.config.bot.roles.administration}>, поступила новая заявка.`, 
          embeds: [Embed(sex, promo, textInput, embedTitle[1], interaction)], 
          components: [ButtonActionRowAdmin(request.id)] 
        })
      await app.prisma.request.update({ where: { id: request.id }, data: { message: msg.id } })
    }
    else if (interaction.customId.startsWith(`join:user:rules:`)) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('Прочтите правила сервера')
            .setURL('https://www.dipix.pw/rules')
            .setFooter({ text: 'Отправляя заявку вы принимаете правила сервера' })
            .setColor('#3ba55d')
        ],
        ephemeral: true
      })
      await (userBuffer[`modal:${request.id}`] as ModalSubmitInteraction).editReply({ embeds: [Embed(sex, promo, textInput, embedTitle[0], interaction)], components: [ButtonActionRowUser(request.id, false, false)] })
    }
    else if (interaction.customId.startsWith(`join:user:biography:`)) {
      await interaction.showModal(ModalActionRowBiography(request.id));
    }
  } catch (err) {
    logger.Error(err)
    interaction.replied ? await interaction.editReply({ embeds: [ErrorEmbed()] }) : await interaction.reply({ embeds: [ErrorEmbed()], ephemeral: true })
  }
})
