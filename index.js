require('dotenv').config(); // Carrega as variáveis do arquivo .env

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Função para rolar o dado
function rollDie(sides, buff = false) {
  if (sides === 'f' || sides === 'F') {
    const fudge = [-1, 0, 1];
    return fudge[Math.floor(Math.random() * 3)];
  }

  sides = parseInt(sides);
  let roll = Math.floor(Math.random() * sides) + 1;

  // Buff exclusivo para d20
  if (buff && sides === 20) {
    const chance = Math.random();
    if (chance < 0.20) {
      const highRolls = [ 16, 17, 18, 19, 20];
      roll = highRolls[Math.floor(Math.random() * highRolls.length)];
    }
  }

  return roll;
}

// Função para formatar o número com negrito apenas se for crítico
function formatResult(roll, sides) {
  return (roll === 1 || roll === sides) ? `**${roll}**` : `${roll}`;
}

client.on('messageCreate', message => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();
  const buff = true;

  const repeatedMatch = content.match(/(\d+)#d(\d+)/);         // Ex: 3#d20
  const multiMatch = content.match(/(\d+)[dD](\d+|f)/);        // Ex: 2d6 ou 3dF
  const singleMatch = content.match(/d(\d+|f)(\+\d+)?/);       // Ex: d20+2

  // Repeated rolls (ex: 4#d20)
  if (repeatedMatch) {
    const count = parseInt(repeatedMatch[1]);
    const sides = repeatedMatch[2];
    const results = [];

    for (let i = 0; i < count; i++) {
      results.push(rollDie(sides, sides == 20 && buff));
    }

    const total = results.reduce((a, b) => a + b, 0);
    const formatted = results.map(r => formatResult(r, parseInt(sides)));

    return message.reply(`🎲 Rolagem **${count}#d${sides}**:\n[ ${formatted.join(", ")} ]\n🧮 Total: **${total}**`);
  }

  // Múltiplos dados normais (ex: 3d6, 2d20)
  if (multiMatch) {
    const count = parseInt(multiMatch[1]);
    const sides = multiMatch[2];
    const results = [];

    for (let i = 0; i < count; i++) {
      results.push(rollDie(sides, sides == 20 && buff));
    }

    const total = results.reduce((a, b) => a + b, 0);
    const formatted = results.map(r => formatResult(r, parseInt(sides)));

    return message.reply(`🎲 Rolagem **${count}d${sides}**:\n[ ${formatted.join(", ")} ]\n🧮 Total: **${total}**`);
  }

  // Rolagem única (ex: d20, d20+2)
  if (singleMatch) {
    const sides = singleMatch[1];
    const modifier = singleMatch[2] ? parseInt(singleMatch[2].replace('+', '')) : 0;
    const roll = rollDie(sides, sides == 20 && buff);
    const total = roll + modifier;
    const formatted = formatResult(roll, parseInt(sides));

    if (modifier > 0) {
      return message.reply(`🎯 Rolagem: **d${sides}+${modifier}** = ${formatted} + ${modifier} → 🎉 **${total}**`);
    } else {
      return message.reply(`🎯 Rolagem: **d${sides}** = ${formatted}`);
    }
  }
});
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot está rodando!');
});

app.listen(3000, () => {
  console.log('Servidor web ativo na porta 3000');
});
client.login(process.env.TOKEN);