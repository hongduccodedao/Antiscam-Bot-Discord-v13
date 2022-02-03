const { Client, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
const axios = require('axios');

const client = new Client({
    intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]
});

client.once('ready', () => {
    client.user.setActivity('Bởi PinkDuwc._#0510', {
        type: 'STREAMING',
        url: 'https://www.twitch.tv/hongduccodedao',
    });
    console.log(`${client.user.tag} đã sẵn sàng!`);
});

client.on('messageCreate', async message => {   
    const res = await axios.get('https://discord-phishing-backend.herokuapp.com/all');
    const array = res.data;
    if (array.some(word => message.content.toLowerCase().includes(word))) {
        console.log(message.content.toLowerCase());
        message.delete()
        console.log(message.author.id)
        const embedUser = new MessageEmbed()
            .setTitle('Thông báo từ hệ thống')
            .setDescription(`Chúng tôi nghi ngờ bạn đã gửi link scam`)
            .addField(`Thông tin người gửi:`, `${message.author.id}`, true)
            .addField(`Tại server:`, `${message.guild.id}(${message.guild.name})`, true)
            .addField(`Tại channel:`, `${message.channel.id}`, true)
            .addField(`Id tin nhắn:`, `${message.id}`, true)
            .addField(`Thời gian:`, `<t:${parseInt(message.createdAt /1000)}:F>`, true)
            .addField(`Nội dung tin nhắn:`, `\`\`\`diff\n${message.content}\`\`\``, false)
            .setColor('#ff0000')
            .setFooter({name: `Code by PinkDuwc._#510`})
        message.author.send({ embeds: [embedUser] });

        const member = message.guild.members.cache.get(message.author.id);
        //Ban member sent scam link
        member.ban({ reason: 'Gửi link scam' });
        const embed = new MessageEmbed()
            .setTitle("Cảnh báo link scam") 
            .setColor("#ff0000")
            .setDescription(`Hình như bạn ${message.author} đã gửi link scam với nội dung: 
            \`\`\`diff\n${message.content}\`\`\``)
            .setFooter({name: `Code by PinkDuwc._#510`})
            
        message.channel.send({ embeds: [embed] }).then(m => { setTimeout(() => { m.delete() }, 10000) })
    }
});

//anticrash
process.on("unhandledRejection", (reason, p) => {
    console.log(reason, p)
})
process.on("uncaughtException", (err, origin) => {
    console.log(err, origin)
})

client.login(token);
