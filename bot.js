const runBot = (Telegraf, token) => {
  console.log('bot v6');

  const bot = new Telegraf(token);

  let textState = 'default';

  const data = {
    origin: '',
    destination: '',
  };

  const states = {
    gettingOriginChannel: {
      reply: 'enter name of origin channel',
      func: (ctx) => {
        data.origin = ctx.message.text;
      },
      nextState: 'gettingDestChannel',
    },
    gettingDestChannel: {
      reply: 'enter name of destination channel',
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

  bot.on('text', (ctx) => {
    console.log('on Text');
    if (states[textState]) {
      ctx.reply(states[textState].reply);

      states[textState].func(ctx);

      setTextState(states[textState].nextState);
    }

    if (ctx.message.text === 'sendamessage') {
      ctx.telegram.sendMessage('@psswrd-mngr', 'your message');
    }

    if ((textState = 'default')) {
      ctx.reply('select a message');
    }
  });

  bot.launch();
};

module.exports = runBot;
