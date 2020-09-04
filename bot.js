const runBot = (Telegraf, token) => {
  const bot = new Telegraf(token);

  let textState = null;

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
      nextState: null,
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
    setTextState(null);

    ctx.reply(`select a command`);
  });

  bot.on('text', (ctx) => {
    if (states[ctx.message.text]) {
      setTextState(states[ctx.message.text].nextState);

      states[ctx.message.text].func(ctx);

      ctx.reply(states[ctx.message.text].reply);
    }

    if (ctx.message.text === 'tell me') {
      ctx.reply(`im telling you`);

      console.log('i told him');
    } else {
      ctx.reply(`select a command`);
    }
  });

  bot.launch();

  console.log('bot v2');
};

module.exports = runBot;
