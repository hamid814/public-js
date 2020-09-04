const runBot = (Telegraf, token) => {
  console.log('bot v7');

  const bot = new Telegraf(token);

  let textState = 'default';

  const data = {
    origin: '',
    destination: '',
  };

  const states = {
    gettingOriginChannel: {
      replyMessage: 'enter name of origin channel',
      func: (ctx) => {
        data.origin = ctx.message.text;
      },
      nextState: 'gettingDestChannel',
    },
    gettingDestChannel: {
      replyMessage: 'enter name of destination channel',
      func: (ctx) => {
        data.destination = ctx.message.text;
      },
      nextState: 'default',
    },
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
    setTextState('default');

    ctx.reply(`select a command`);
  });

  bot.command('getchannel', async (ctx) => {
    const res = await ctx.telegram.channels.getFullChannel('@psswrd_mngr');

    console.log(res);

    ctx.reply('checkout console');
  });

  bot.on('text', (ctx) => {
    console.log('Text Recived');
    console.log(states[textState]);

    if (states[textState]) {
      states[textState].func(ctx);

      ctx.reply(states[textState].replyMessage);

      setTextState(states[textState].nextState);
    }

    if (textState === 'default') {
      ctx.reply('select a command');
    }
  });

  bot.launch();
};

module.exports = runBot;
