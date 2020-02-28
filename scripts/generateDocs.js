'use es6'
const fs = require('fs');
const util = require('../../Spudnik/dist/lib/helpers');

const categories = fs.readdirSync('commands')
    .filter(path => fs.statSync(`commands/${path}`).isDirectory())
    .map(category => {
        var commands = fs.readdirSync('commands/'+category).map(fileName => {
            const command = require(`commands/category/${fileName}`);
            const commandDetails = {
                description: comman.description,
                usage: command.usage.fullUsage(),
                details: command.extendedHelp ? (typeof command.extendedHelp === 'function' ? command.extendedHelp() : command.extendedHelp) : null,
                aliases: command.aliases.length > 0 ? command.aliases.join(', ') : 'None',
                category: command.category,
                bot_perms: command.requiredPermissions.bitfield ? `${util.getPermissionsFromBitfield(command.requiredPermissions).join('\n')}` : 'No extra perms required',
                user_perms: command.permissionLevel ? `${command.permissionLevel}: ${util.getPermissionsFromLevel(command.permissionLevel)}` : 'No special user perms required',
                nsfw: command.nsfw
            }
            return JSON.parse(JSON.stringify({
                [fileName.split('.ts')[0]]: [commandDetails]
            }));
        });
        return JSON.parse(JSON.stringify({[category]: [commands]}));
    });

fs.writeFileSync('./command-list.json', JSON.stringify(categories, null, 2), 'utf-8');
