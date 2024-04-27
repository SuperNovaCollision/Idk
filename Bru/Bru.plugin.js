/**
 * @name Bru
 * @version 1.0.0
 * @description Broken Plugin
 */

module.exports = (() => {
	/* Configuration */
	const config = {
		info: {
			name: "Bru",
			authors: [{
				name: "Dark",
				discord_id: "1160068257957564517"
			}],
			version: "1.0.0",
			description: "Broken Plugin",
			github: "https://github.com/SuperNovaCollision/Idk/blob/main/Bru/Bru.plugin.js",
			github_raw: "https://raw.githubusercontent.com/SuperNovaCollision/Idk/main/Bru/Bru.plugin.js"
		},
		/* Settings */
		defaultConfig: [{
			/* General Settings */
			id: "setting",
			name: "General Sound",
			type: "category",
			collapsible: true,
			shown: false,
			settings: [
				/* Limit Channel */
				{id: "LimitChan", name: "Limit To Current Channel", note: "When enabled, sound effects will only play within the currently selected channel.", type: "switch", value: true},
				/* Sound Delay */
				{id: "delay", name: "Sound Effect Delay", note: "The delay in milliseconds between each sound effect.", type: "slider", value: 200, min: 10, max: 1000, renderValue: v => Math.round(v) + "ms" },
				/* Sound Volume */
				{ id: "volume", name: "Sound Effect Volume", note: "How loud the sound effects will be.", type: "slider", value: 1, min: 0.01, max: 1, renderValue: v => Math.round(v * 100) + "%" }
			]
		},
		{
			/* Toggle Sounds */
			id: "toggle",
			name: "Toggle Sounds",
			type: "category",
			collapsible: true,
			shown: false,
			settings: [
				{ id: "bazinga", name: "Bazinga", type: "switch", value: true },
				{ id: "bruh", name: "Bruh", type: "switch", value: true },
				{ id: "cheeseburger", name: "Chezburger", type: "switch", value: true },
				{ id: "hamburger", name: "Hamburger", type: "switch", value: true },
				{ id: "halo", name: "halo", type: "switch", value: true },
				{ id: "noice", name: "Noice", type: "switch", value: true },
				{ id: "ok", name: "Ok", type: "switch", value: true },
				{ id: "okiedokie", name: "Okiedokie", type: "switch", value: true },
				{ id: "oof", name: "Oof", type: "switch", value: true },
				{ id: "vineboom", name: "Vine Boom", type: "switch", value: true },
				{ id: "vsauce", name: "Vsauce", type: "switch", value: false },
				{ id: "yahoo", name: "Yahoo!", type: "switch", value: true },
				{ id: "yippee", name: "Yippee!", type: "switch", value: true }
			]
		}],
		changelog: [{
            title: "Ayo",
            items: [
                "FBI OPEN UP"
            ]
        }]
	};

	/* Library Stuff */
	return !global.ZeresPluginLibrary
		? class {
			constructor() {
				this._config = config;
			}
			getName() {
				return config.info.name;
			}
			getAuthor() {
				return config.info.authors.map(a => a.name).join(", ");
			}
			getDescription() {
				return config.info.description;
			}
			getVersion() {
				return config.info.version;
			}
			load() {
				BdApi.showConfirmationModal("Library Missing!", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, { confirmText: "Download Now", cancelText: "Cancel", onConfirm: () => { require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (err, res, body) => { if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9"); await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r)); }); } });
			}
			start() { }
			stop() { }
		}
		: (([Plugin, Api]) => {
			const plugin = (Plugin, Api) => {
				try {
					const {DiscordModules: {Dispatcher, SelectedChannelStore}} = Api;
					const sounds = [
						{re: /brazil/gmi, file: "bazinga.mp3", duration: 730},
						{re: /bruh/gmi, file: "bruh.mp3", duration: 365},
						{re: /🍔/gmi, file: "cheeseburger.mp3", duration: 1000},
						{re: /hamburger/gmi, file: "hamburger.mp3", duration: 1000},
						{re: /halo/gmi, file: "hello.mp3", duration: 750},
						{re: /no?ice/gmi, file: "noice.mp3", duration: 800},
						{re: /ok/gmi, file: "ok.mp3", duration: 700},
						{re: /okiedokie/gmi, file: "okiedokie.mp3", duration: 907},
						{re: /oof/gmi, file: "oof.mp3", duration: 265},
						{re: /🗿/gmi, file: "vineboom.mp3", duration: 1115},
						{re: /what if/gmi, file: "vsauce.mp3", duration: 7000},
						{re: /yahoo/gmi, file: "yahoo.mp3", duration: 930},
						{re: /yip?pee/gmi, file: "yippee.mp3", duration: 1000}
					];

					let lastMessageID = null;

					return class MemeSounds extends Plugin {
						constructor() {
							super();
						}

						getSettingsPanel() {
							return this.buildSettingsPanel().getElement();
						}

						onStart() {
							Dispatcher.subscribe("MESSAGE_CREATE", this.messageEvent);
						}

						messageEvent = async ({ channelId, message, optimistic }) => {
							if (this.settings.setting.LimitChan && channelId != SelectedChannelStore.getChannelId()) return;

							if (!optimistic && lastMessageID != message.id) {
								lastMessageID = message.id;
								let queue = new Map();
								const allSounds = [...sounds];

								for (let sound of allSounds) {
									for (let match of message.content.matchAll(sound.re)) {
										queue.set(match.index, sound);
									}
								}

								for (let sound of [...queue.entries()].sort((a, b) => a[0] - b[0])) {
									if (this.settings.toggle[sound[1].file.replace(/\..+$/, "")]) {
										let audio = new Audio("https://github.com/SuperNovaCollision/Idk/tree/main/Sounds/" + sound[1].file);
										audio.volume = this.settings.setting.volume;
										audio.play();
										await new Promise(r => setTimeout(r, sound[1].duration + this.settings.setting.delay));
									}
								}
							}
						};
						onStop() {
							Dispatcher.unsubscribe("MESSAGE_CREATE", this.messageEvent);
						}
					};
				}
				catch (e) {
					console.error(e);
				}
			};
			return plugin(Plugin, Api);
		})(global.ZeresPluginLibrary.buildPlugin(config));
})();
