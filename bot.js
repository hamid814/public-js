const runBot = (Telegraf, token) => {
  console.log('bot v16');

  const bot = new Telegraf(token);

  let textState = 'default';

  const appState = {
    origin: '',
    destination: '',
    forwardFormId: '',
    forwardToId: '',
    forwardMessageId: '',
    fileId: '',
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
    gettingForwardFromId: {
      replyMessage: 'now give me forward to id',
      func: async (ctx) => {
        appState.forwardFormId = ctx.message.text;
      },
      nextState: 'gettingForwardToId',
    },
    gettingForwardToId: {
      replyMessage: 'now give me id of message',
      func: async (ctx) => {
        appState.forwardToId = ctx.message.text;
      },
      nextState: 'gettingForwardMessageId',
    },
    gettingForwardMessageId: {
      replyMessage: 'check it out!',
      func: async (ctx) => {
        try {
          const messageId = Number(ctx.message.text);

          const res = await ctx.telegram.forwardMessage(
            appState.forwardToId,
            appState.forwardFormId,
            messageId
          );

          ctx.reply('sent');

          const context = ctx;

          const message = res;

          delete message.forward_from_message_id;
          delete message.forward_date;
          delete message.forward_from_chat;

          setTimeout(async () => {
            try {
              const res = await context.telegram.sendCopy(
                appState.forwardToId,
                message
              );

              console.log('without forward:');
              console.log(res);

              ctx.reply('without forward sent!');
            } catch (err) {
              console.log(err);
              context.reply('there was an error in copying');
            }
          }, 2000);

          console.log(res);
        } catch (err) {
          ctx.reply('there was an error in forwardin');

          console.log(err);
        }
      },
      nextState: 'default',
    },
    gettingFileId: {
      reply: 'this is your file link:',
      func: async (ctx) => {
        const res = await ctx.telegram.getFileLink(ctx.message.text);

        console.log(res);

        ctx.reply(res);
      },
      nextState: 'default',
    },
    gettingUserId: {
      reply: 'this is user name',
      func: async (ctx) => {
        const res = await ctx.telegram.getChat(ctx.message.text);

        console.log(res);

        appState.fileId = res.res.photo.big_file_id;

        ctx.reply(`id: ${res.id}
title: ${res.title}
username: ${res.username}
type: ${res.type}
photo: ${res.photo}
big photo id: ${res.photo.big_file_id}`);
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
    setTextState('gettingForwardFromId');

    ctx.reply('give me id of from channel');
  });

  bot.command('getlink', (ctx) => {
    setTextState('gettingFileId');

    ctx.reply('send the ID of FILE');
  });

  bot.command('getuser', async (ctx) => {
    setTextState('gettingUserId');

    ctx.reply('Send me th id on User');
  });

  bot.command('/getphoto', (ctx) => {
    ctx.replyWithPhoto(appState.fileId);
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
