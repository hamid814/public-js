const runBot = (Telegraf, token) => {
  console.log('--- Start of online Code ---');

  console.log('token: ', token);

  const bot = new Telegraf(token);

  bot.start((ctx) => ctx.reply('hehe, from code'));

  bot.command('sendall', (ctx) => ctx.reply('چشم'));
  bot.command('sayname', (ctx) => ctx.reply('hamid'));

  bot.on('text', (ctx) => {
    console.log('on text');

    bot.telegram.sendMessage('hehe test');

    if (ctx.message.text === 'tell me') {
      ctx.reply(`im telling you`);

      console.log('i told him');
    } else {
      ctx.reply(`:: ${ctx.message.from.username} ::`);
    }
  });

  bot.launch();

  console.log('--- End of online Code ---');
};

module.exports = runBot;
