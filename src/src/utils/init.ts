import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import { ensureDirectory } from './etc.js';
import { readFile, writeFile } from './file.js';
import { exec } from './exec.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HOME } from '../utils.js';

export function isRunning(dbusName: string, bus: 'session' | 'system') {
    return Gio.DBus[bus].call_sync(
        'org.freedesktop.DBus',
        '/org/freedesktop/DBus',
        'org.freedesktop.DBus',
        'NameHasOwner',
        GLib.Variant.new_tuple([new GLib.Variant('s', dbusName)]),
        new GLib.VariantType('(b)'),
        Gio.DBusCallFlags.NONE,
        -1,
        null,
    ).deepUnpack()?.toString() === 'true' || false;
}

export function parsePath(path: string) {
    return path.startsWith('.')
        ? `${GLib.getenv('PWD')}${path.slice(1)}`
        : path;
}

const defaultConfig = `
const time = Variable('', {
    poll: [1000, function() {
        return Date().toString()
    }],
})

const Bar = (/** @type {number} */ monitor) => Widget.Window({
    monitor,
    name: \`bar\${monitor}\`,
    anchor: ['top', 'left', 'right'],
    exclusivity: 'exclusive',
    child: Widget.CenterBox({
        start_widget: Widget.Label({
            hpack: 'center',
            label: 'Welcome to AGS!',
        }),
        end_widget: Widget.Label({
            hpack: 'center',
            label: time.bind(),
        }),
    }),
})

App.config({
    windows: [Bar(0)],
})
`;

const readMe = (types: string) => `
# Starter Config

if suggestions don't work, first make sure
you have TypeScript LSP working in your editor

if you do not want typechecking only suggestions

\`\`\`json
// tsconfig.json
"checkJs": false
\`\`\`

types are symlinked to:
${types}
`;

const defaultTsConfig = {
    compilerOptions: {
        target: 'ES2022',
        module: 'ES2022',
        lib: ['ES2022'],
        allowJs: true,
        checkJs: true,
        strict: true,
        noImplicitAny: false,
        baseUrl: '.',
        typeRoots: ['./types'],
        skipLibCheck: true,
    },
};

const tsconfigWarning = `existing tsconfig detected
make sure it has "typeRoots": ["./types"]`;

export async function init(configDir: string, entry: string) {
    ensureDirectory(configDir);
    const tsconfig = configDir + '/' + 'tsconfig.json';

    if (!GLib.file_test(entry, GLib.FileTest.EXISTS))
        await writeFile(defaultConfig.trim(), entry);


    if (!GLib.file_test(tsconfig, GLib.FileTest.EXISTS)) {
        await writeFile(JSON.stringify(defaultTsConfig, null, 2), tsconfig);
    } else {
        try {
            const conf = JSON.parse(readFile(tsconfig));
            const list = conf.compilerOptions.typeRoots;
            if (!list.includes('./types'))
                conf.compilerOptions.typeRoots = [...list, './types'];

            await writeFile(JSON.stringify(conf, null, 2), tsconfig);
        } catch (err) {
            logError(err);
            console.warn(tsconfigWarning);
        }
    }

    const types = `${pkg.pkgdatadir}/types`;

    exec(`ln -s -f ${types} ${configDir}/types`);
    await writeFile(readMe(types), `${configDir}/README.md`);
    print(`config directory setup at "${configDir}"`);
}
