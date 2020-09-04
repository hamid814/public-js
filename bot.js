const runBot = (Telegraf, token) => {
  console.log('bot v13');

  const bot = new Telegraf(token);

  let textState = 'default';

  const appState = {
    origin: '',
    destination: '',
  };

  const textStates = {
    gettingOriginChannel: {
      replyMessage: 'enter name of destination channel',
      func: (ctx) => {
        appState.origin = ctx.message.text;
      },
      nextState: 'gettingDestChannel',
    },
    gettingDestChannel: {
      replyMessage: 'data saved',
      func: (ctx) => {
        appState.destination = ctx.message.text;
      },
      nextState: 'default',
    },
    sendingMessage: {
      replyMessage: 'sent!',
      func: async (ctx) => {
        const res = await ctx.telegram.sendMessage(
          '@psswrd_mngr',
          ctx.message.text
        );

        console.log(res);
      },
      nextState: 'default',
    },
    gettingForwardMessageId: {
      replyMessage: 'sent, check it out!',
      func: async (ctx) => {
        const res = await ctx.telegram.forwardMessage(
          '@psswrd_mngr',
          '@qqqqwwweeeerrr',
          ctx.message.text
        );

        console.log(res);
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
    origin: ${appState.origin}
destination: ${appState.destination}
    `);
  });

  bot.command('cleardata', (ctx) => {
    appState.origin = '';
    appState.destination = '';

    ctx.reply('cleared');
  });

  bot.command('cancel', (ctx) => {
    setTextState('default');

    ctx.reply(`select a command`);
  });

  bot.command('getchannel', async (ctx) => {
    const res = await ctx.telegram.getChat('@psswrd_mngr');

    console.log(res);

    ctx.reply('checkout console');
  });

  bot.command('sendmessage', async (ctx) => {
    setTextState('sendingMessage');

    ctx.reply('what do i send?');
  });

  bot.command('sendcopy', async (ctx) => {
    // const res = await ctx.telegram.sendCopy('@psswrd_mngr');

    console.log('send copy ( uncomplete function )');

    ctx.reply('check out console, code from phone');
  });

  bot.command('forward', (ctx) => {
    setTextState('gettingForwardMessageId');

    ctx.reply('give me id of message');
  });

  bot.on('text', (ctx) => {
    console.log('Text Recived');

    if (textStates[textState]) {
      textStates[textState].func(ctx);

      ctx.reply(textStates[textState].replyMessage);

      setTextState(textStates[textState].nextState);
    }

    if (textState === 'default') {
      ctx.reply('select a command');
    }
  });

  bot.launch();
};

module.exports = runBot;
