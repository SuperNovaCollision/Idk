module.exports = (Plugin, Library) => {

    const {Logger, Patcher, Settings} = Library;
    
    return class Bru extends Plugin {
        onStart() {
            Patcher.before(Logger, "log", (t, a) => {
                a[0] = "Patched Message: " + a[0];
            });
        }

        onStop() {
            Patcher.unpatchAll();
        }
    };
};