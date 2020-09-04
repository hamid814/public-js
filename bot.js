const runBot = (Telegraf, token) => {
  const bot = new Telegraf(token);

  let textState = null;

  const data = {
    origin: '',
    destination: '',
  };

  const setTextState = (state) => {
    textState = state;
  };

  bot.start((ctx) => ctx.reply('bot is being developed'));

  bot.command('sendall', (ctx) => {
    setTextState('gettingOriginChannel');

    ctx.reply('enter name of origin channel');
  });

  bot.command('getdata', (ctx) => {
    ctx.reply(`
    origin: ${data.origin}
    destination: ${data.destination}
    `);
  });

  bot.command('cleardata', (ctx) => {
    data.origin = '';
    data.destination = '';

    ctx.reply('cleared');
  });

  bot.command('cancel', (ctx) => {
    setTextState(null);

    ctx.reply(`select a command`);
  });

  bot.on('text', (ctx) => {
    if (textState === 'gettingOriginChannel') {
      data.origin = ctx.message.text;

      setTextState('gettingDestChannel');

      ctx.reply('enter name of destination channel');
    }

    if (textState === 'gettingDestChannel') {
      data.destination = ctx.message.text;

      setTextState(null);
      ctx.reply('Done for now');
    }

    if (ctx.message.text === 'tell me') {
      ctx.reply(`im telling you`);

      console.log('i told him');
    } else {
      ctx.reply(`select a command`);
    }
  });

  bot.launch();

  console.log('bot v1');
};

module.exports = runBot;
